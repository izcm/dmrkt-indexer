import { FastifyInstance, RouteShorthandOptions } from 'fastify'

import { COLLECTIONS } from '#app/domain/constants/db.js'
import { DEFAULT_PAGE_LIMIT } from '#app/domain/constants/api.js'
import { ADDR_REGEX } from '#app/domain/constants/regex.js'

import { byIdParams } from '#app/schemas/shared.js'

export const settlementsQuery = (fastify: FastifyInstance) => {
  const dbSettlements = fastify.mongo.db?.collection(COLLECTIONS.SETTLEMENTS)
  const { ObjectId } = fastify.mongo

  if (!dbSettlements) throw new Error('Could not find db settlements')

  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { schema: { params: byIdParams } },
    async (req, res) => {
      const doc = await dbSettlements.findOne({ _id: new ObjectId(req.params.id) })

      if (!doc) {
        res.code(404)
        return
      }

      return doc
    }
  )

  fastify.get(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          additionalProperties: false,
          properties: {
            collection: { type: 'string', pattern: ADDR_REGEX },
            tokenId: { type: 'string', pattern: '^[0-9]+$' },
            seller: { type: 'string', pattern: ADDR_REGEX },
            buyer: { type: 'string', pattern: ADDR_REGEX },
            from: { type: 'integer', minimum: 0 }, // timestamp
            to: { type: 'integer', minimum: 0 }, // timestamp
            limit: { type: 'integer', minimum: 1, maximum: 100 },
            cursor: { type: 'string', pattern: '^[0-9]+_[a-fA-F0-9]{24}$' },
          },
        },
      },
    },
    async req => {
      const { from, to, limit, cursor, ...filters } = req.query as Record<string, any>

      const query = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined))

      const blockTs = 'execution.block.timestamp'

      if (from || to) {
        query[blockTs] = {}
        if (from) query[blockTs].$gte = from
        if (to) query[blockTs].$lte = to
      }

      // from / to + cursor can conflict (timestamp collision) which then returns an empty set
      // callers are responsible for constructing sensible queries
      if (cursor) {
        const [ts, id] = cursor.split('_')

        query.$and = [
          {
            $or: [
              { blockTs: { $lt: Number(ts) } },
              { blockTs: Number(ts), _id: { $lt: new ObjectId(id as string) } },
            ],
          },
        ]
      }

      const pageLimit = limit ?? DEFAULT_PAGE_LIMIT

      const docs = await dbSettlements
        .find(query)
        .sort({ blockTs: -1, _id: -1 })
        .limit(pageLimit + 1)
        .toArray()

      let nextCursor: string | null = null

      if (docs.length > pageLimit) {
        const last = docs[pageLimit - 1]
        nextCursor = `${last.execution.block.timestamp}_${last._id.toString()}`
      }

      return {
        items: docs.slice(0, pageLimit),
        nextCursor,
      }
    }
  )
}

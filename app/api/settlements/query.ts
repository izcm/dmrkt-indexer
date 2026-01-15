import { FastifyInstance, RouteShorthandOptions } from 'fastify'

import { COLLECTIONS } from '#app/data/constants/db.js'
import { DEFAULT_PAGE_LIMIT } from '#app/data/constants/api.js'
import { ADDR_REGEX } from '#app/data/constants/regex.js'

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

      if (from || to) {
        query['block.timestamp'] = {}
        if (from) query['block.timestamp'].$gte = from
        if (to) query['block.timestamp'].$lte = to
      }

      // from / to + cursor can conflict (timestamp collision) which then returns an empty set
      // callers are responsible for constructing sensible queries
      if (cursor) {
        const [ts, id] = cursor.split('_')

        query.$and = [
          {
            $or: [
              { 'block.timestamp': { $lt: Number(ts) } },
              { 'block.timestamp': Number(ts), _id: { $lt: new ObjectId(id as string) } },
            ],
          },
        ]
      }

      const pageLimit = limit ?? DEFAULT_PAGE_LIMIT

      const docs = await dbSettlements
        .find(query)
        .sort({ 'block.timestamp': -1, _id: -1 })
        .limit(pageLimit + 1)
        .toArray()

      let nextCursor: string | null = null

      if (docs.length > pageLimit) {
        const last = docs[pageLimit - 1]
        nextCursor = `${last.block.timestamp}_${last._id.toString()}`
      }

      return {
        items: docs.slice(0, pageLimit),
        nextCursor,
      }
    }
  )
}

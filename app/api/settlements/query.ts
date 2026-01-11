import { mongodb } from '@fastify/mongodb'
import { FastifyInstance, RouteShorthandOptions } from 'fastify'

// schemas
import { byIdParams } from '#app/schemas/shared'

const opts: RouteShorthandOptions = {}
export const settlementsQuery = (fastify: FastifyInstance) => {
  const dbCollection = fastify.mongo.db?.collection('settlements')
  const { ObjectId } = fastify.mongo

  if (!dbCollection) throw new Error('Could not find db settlements')
  const addrRegex = '^0x[a-fA-F0-9]{40}$'

  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { schema: { params: byIdParams } },
    async (req, res) => {
      const doc = await dbCollection.findOne({ _id: new ObjectId(req.params.id) })

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
            collection: { type: 'string', pattern: addrRegex },
            tokenId: { type: 'string', pattern: '^[0-9]+$' },
            seller: { type: 'string', pattern: addrRegex },
            buyer: { type: 'string', pattern: addrRegex },
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

        query.$or = [
          { 'block.timestamp': { $lt: Number(ts) } },
          { 'block.timestamp': Number(ts), _id: { $lt: new ObjectId(id as string) } },
        ]
      }

      return dbCollection
        .find(query)
        .sort({ 'block.timestamp': -1, _id: -1 })
        .limit(limit ?? 50)
        .toArray()
    }
  )
}

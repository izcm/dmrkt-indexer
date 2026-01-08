import { FastifyInstance } from 'fastify'
import { ObjectId } from 'mongodb'

export const settlementsQuery = (app: FastifyInstance) => {
  const dbCollection = app.mongo.db?.collection('settlements')
  const addrRegex = '^0x[a-fA-F0-9]{40}$'

  app.get(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
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
        additionalProperties: false,
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
          { 'block.timestamp': Number(ts), _id: { $lt: new ObjectId(id) } },
        ]
      }

      const results = dbCollection!
        .find(query)
        .sort({ 'block.timestamp': -1, _id: -1 })
        .limit(limit ?? 50)
        .toArray()

      return results
    }
  )
}

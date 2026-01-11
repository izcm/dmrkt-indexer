import { mongodb } from '@fastify/mongodb'
import { FastifyInstance } from 'fastify'

// schema validation
import { byIdParams, paginationQueryParams } from '#app/schemas/shared'
import { orderQueryableFields } from '#app/schemas/order'

export const ordersQuery = (fastify: FastifyInstance) => {
  const dbCollection = fastify.mongo.db?.collection('orders')
  const { ObjectId } = fastify.mongo

  if (!dbCollection) throw new Error('Could not find db orders')

  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { schema: { params: byIdParams } },
    async (req, res) => {
      const doc = await dbCollection?.findOne({ _id: new ObjectId(req.params.id) })

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
            ...orderQueryableFields,
            ...paginationQueryParams,
          },
        },
      },
    },
    async req => {
      const { from, to, limit, cursor, ...filters } = req.query as Record<string, any>

      const query = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined))

      return dbCollection
        .find(query)
        .limit(limit ?? 50)
        .toArray()
    }
  )
}

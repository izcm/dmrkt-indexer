import { FastifyInstance } from 'fastify'

import { COLLECTIONS } from '#app/domain/constants/db.js'
import { DEFAULT_PAGE_LIMIT } from '#app/domain/constants/api.js'

import { byIdParams, paginationQueryParams } from '#app/schemas/shared.js'
import { orderQueryableFields } from '#app/schemas/order.js'

export const ordersQuery = (fastify: FastifyInstance) => {
  const dbCollection = fastify.mongo.db?.collection(COLLECTIONS.ORDERS)
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
        .limit(limit ?? DEFAULT_PAGE_LIMIT)
        .toArray()
    }
  )
}

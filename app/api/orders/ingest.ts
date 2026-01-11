import { FastifyInstance } from 'fastify'
import { Order } from '#app/domain/order'

export const ordersIngest = (fastify: FastifyInstance) => {
  const dbCollection = fastify.mongo.db?.collection('orders')

  if (!dbCollection) throw new Error('Could not find db orders')

  fastify.post<{ Body: Order }>('/', { schema: { body: { $ref: 'order#' } } }, async (req, res) => {
    const { insertedId } = await dbCollection.insertOne(req.body)

    res.code(201).header('Location', `/api/orders/${insertedId}`)

    return { id: insertedId }
  })
}

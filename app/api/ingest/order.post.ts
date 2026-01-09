import { FastifyInstance } from 'fastify'

export const ordersIngest = (fastify: FastifyInstance) => {
  fastify.post('/', { schema: { body: { $ref: 'order#' } } }, async (req, res) => {
    await fastify.mongo.db!.collection('orders').insertOne(req.body as any)
    return { ok: true }
  })
}

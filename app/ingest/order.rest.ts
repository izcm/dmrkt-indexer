import { FastifyInstance } from 'fastify'

export const ordersIngest = (app: FastifyInstance) => {
  app.post('/', async (req, res) => {
    await app.mongo.db!.collection('orders').insertOne(req.body as any)

    return { ok: true }
  })
}

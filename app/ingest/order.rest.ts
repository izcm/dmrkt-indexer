import { FastifyInstance } from 'fastify'

export const ordersIngest = (app: FastifyInstance) => {
  app.post('/', async (req, res) => {
    const payload = req.body

    // later:
    // 1. verify signature (viem)
    // 2. normalize fields
    // 3. store in Mongo
    return { ok: true }
  })
}

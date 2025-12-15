import Fastify from 'fastify'

// local
import { ordersIngest } from './ingest/order.rest'

export const startServer = async () => {
  const app = Fastify({ logger: true })

  app.register(ordersIngest, { prefix: '/orders' })

  await app.listen({ port: 3001 })
}

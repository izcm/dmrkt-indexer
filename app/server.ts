import Fastify from 'fastify'

import { mongo } from './db/mongo.js'
import { ordersIngest } from './ingest/order.rest.js'

// schemas
import { OrderSchema } from './db/schemas/order.js'

const fastify = Fastify({
  logger: true,
})

export const start = async () => {
  // infra plugins
  fastify.register(mongo)

  // schemas
  fastify.addSchema(OrderSchema)

  // routes
  fastify.register(ordersIngest, { prefix: '/orders' })

  fastify.listen({ port: 5000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
  })
}

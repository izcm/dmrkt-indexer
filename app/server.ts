import Fastify from 'fastify'

import { dbConnector } from './db/mongo.fastify.js'
import { ordersIngest } from './ingest/order.rest.js'

// schemas
import { OrderSchema } from './db/schemas/order.js'

const app = Fastify({
  logger: true,
})

export const start = async () => {
  // infra plugins
  await app.register(dbConnector)

  // schemas
  app.addSchema(OrderSchema)

  // routes
  app.register(ordersIngest, { prefix: '/api/orders' })

  app.listen({ port: 5000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    app.log.info(`server listening on ${address}`)
  })
}

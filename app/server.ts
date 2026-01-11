import Fastify from 'fastify'

import { dbConnector } from './db/mongo.fastify.js'

// api routes - ORDERS
import { settlementsQuery } from './api/settlements/query.js'

// api routes - SETTLEMENTS
import { ordersIngest } from './api/orders/ingest.js'
import { ordersQuery } from './api/orders/query.js'

// schemas
import { orderBody } from './schemas/order.js'

const app = Fastify({
  logger: true,
})

export const start = async () => {
  // infra plugins
  await app.register(dbConnector)

  // register all defined bodies
  app.addSchema(orderBody)

  // routes - orders
  app.register(ordersIngest, { prefix: '/api/orders' })
  app.register(ordersQuery, { prefix: '/api/orders' })

  // routes - settlements
  app.register(settlementsQuery, { prefix: '/api/settlements' })

  app.listen({ port: 5000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    app.log.info(`server listening on ${address}`)
  })
}

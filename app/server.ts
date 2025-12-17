import Fastify from 'fastify'
import mongodb from '@fastify/mongodb'

import { ordersIngest } from './ingest/order.rest.js'

const fastify = Fastify({
  logger: true,
})

const MONGODB_URI = process.env.MONGODB_URI

export const start = async () => {
  fastify.register(mongodb, {
    forceClose: true,
    url: MONGODB_URI,
    database: 'dmrkt',
  })

  fastify.register(ordersIngest, { prefix: '/orders' })

  fastify.listen({ port: 5000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
  })
}

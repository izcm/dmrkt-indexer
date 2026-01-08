import fp from 'fastify-plugin'
import mongodb from '@fastify/mongodb'
import { FastifyInstance } from 'fastify'

const MONGODB_URI = process.env.MONGODB_URI

export const dbConnector = fp(async (app: FastifyInstance) => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set')
  }

  await app.register(mongodb, {
    forceClose: true,
    url: MONGODB_URI,
    database: 'dmrkt',
  })
})

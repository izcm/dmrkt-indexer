import fp from 'fastify-plugin'
import mongodb from '@fastify/mongodb'
import { FastifyInstance } from 'fastify'

export const dbConnector = fp(async (app: FastifyInstance) => {
  const MONGODB_URI = process.env.MONGODB_URI
  const DB_NAME = process.env.DB_NAME

  if (!MONGODB_URI || !DB_NAME) {
    throw new Error('Error reading db config')
  }

  await app.register(mongodb, {
    forceClose: true,
    url: MONGODB_URI,
    database: DB_NAME,
  })
})

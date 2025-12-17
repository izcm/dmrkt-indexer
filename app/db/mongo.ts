import { FastifyInstance } from 'fastify'
import mongodb from '@fastify/mongodb'

const MONGODB_URI = process.env.MONGODB_URI

export const mongo = async (app: FastifyInstance) => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set')
  }

  await app.register(mongodb, {
    forceClose: true,
    url: MONGODB_URI,
    database: 'dmrkt',
  })
}

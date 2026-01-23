import { MongoClient, Db } from 'mongodb'

let db: Db | null = null

export const initDb = async () => {
  const MONGODB_URI = process.env.MONGODB_URI
  const DB_NAME = process.env.DB_NAME

  if (!MONGODB_URI || !DB_NAME) {
    throw new Error('Error reading db config from .env')
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()

  db = client.db(DB_NAME)
}

export const getDb = (): Db => {
  if (!db) {
    throw new Error('DB not initialized')
  }
  return db
}

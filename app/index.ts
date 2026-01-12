import 'dotenv/config'

// listener
import { initDb } from './db/mongo.client.js'
import './listeners/listener.js'

// api
import { start } from './server.js'

async function main() {
  console.log('🚀 Starting DMrkt Indexer...')

  console.log('📦 Initializing database connection...')
  await initDb()
  console.log('✅ Database connected')

  console.log('🌐 Starting API server...')
  await start()
}

main().catch(err => {
  console.log(err)
  process.exit(1)
})

import 'dotenv/config'

// db
import { initDb } from './db/mongo.js'

// listener
import './listeners/index.js'

// api
import { start as startServer } from './api/server.js'

// workers
import { start as startWorkers } from './workers/index.js'

async function main() {
  console.log('---------------------------------')
  console.log('booting up d | mrkt indexer...')
  console.log('---------------------------------')

  console.log('initializing database connection...')
  await initDb()
  console.log('database connected ✔')

  console.log('starting API server...')
  await startServer()

  console.log('starting background workers...')
  startWorkers()
}

main().catch(err => {
  console.log(err)
  process.exit(1)
})

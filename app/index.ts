import 'dotenv/config'

// listener
import { initDb } from './db/mongo.client.js'
import './listeners/listener.js'

// api
import { start } from './server.js'

async function main() {
  await initDb()
  await start()
}

main().catch(err => {
  console.log(err)
  process.exit(1)
})

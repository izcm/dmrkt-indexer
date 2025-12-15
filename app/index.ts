import 'dotenv/config'

import { startServer } from './server'
import { connectDB } from './db/mongo'

async function main() {
  await connectDB()
  await startServer()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

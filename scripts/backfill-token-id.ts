import 'dotenv/config'

import { initDb } from '#app/db/mongo.js'
import { orders, settlements, nfts } from '#app/db/collections.js'
import { padTokenId } from '#app/repos/mongo/model/field-config.js'

async function backfillOrders() {
  const cursor = orders().find({ 'db.tokenId': { $exists: false } })
  const ops = []
  for await (const doc of cursor) {
    ops.push({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { 'db.tokenId': padTokenId(doc.order.tokenId) } },
      },
    })
  }
  if (ops.length) await orders().bulkWrite(ops)
  console.log(`orders: padded ${ops.length}`)
}

async function backfillSettlements() {
  const cursor = settlements().find({ 'db.tokenId': { $exists: false } })
  const ops = []
  for await (const doc of cursor) {
    ops.push({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { 'db.tokenId': padTokenId(doc.tokenId) } },
      },
    })
  }
  if (ops.length) await settlements().bulkWrite(ops)
  console.log(`settlements: padded ${ops.length}`)
}

async function backfillNfts() {
  const cursor = nfts().find({ 'db.tokenId': { $exists: false } })
  const ops = []
  for await (const doc of cursor) {
    ops.push({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { 'db.tokenId': padTokenId(doc.tokenId) } },
      },
    })
  }
  if (ops.length) await nfts().bulkWrite(ops)
  console.log(`nfts: padded ${ops.length}`)
}

await initDb()

await backfillOrders()
await backfillSettlements()
await backfillNfts()

process.exit(0)

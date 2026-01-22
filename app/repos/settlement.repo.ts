import { Hex } from 'viem'
import { getDb } from '#app/db/mongo.client.js'

import type { Settlement, SettlementMeta } from '#app/domain/types/settlement.js'
import { COLLECTIONS } from '#app/domain/constants/db.js'

export const save = async (settlement: Settlement) => {
  const db = getDb()

  await Promise.all([
    db.collection(COLLECTIONS.ORDER_STATES).updateOne(
      { orderHash: settlement.orderHash },
      {
        $set: {
          status: 'filled',
          updatedAt: Date.now(),
        },
      },
      { upsert: true }
    ),
    db.collection(COLLECTIONS.SETTLEMENTS).insertOne({
      ...settlement,
      ingestedAt: Date.now(),
    }),
  ])
}

export const updateWithMeta = async (txHash: Hex, meta: SettlementMeta) => {
  const db = getDb()

  db.collection(COLLECTIONS.SETTLEMENTS).updateOne(
    { 'execution.txHash': txHash },
    {
      $set: {
        orderMeta: meta['order'],
        'execution.txContext': meta['txContext'],
      },
    }
  )
}

import { getDb } from '#app/db/mongo.client.js'

// types
import { Settlement } from '#app/domain/types/settlement.js'
import { IngestionContext } from '../types/context.js'

import { COLLECTIONS } from '#app/domain/constants/db.js'

export const persist = async (settlement: Settlement, ingestion: IngestionContext) => {
  const db = getDb()

  await Promise.all([
    db.collection(COLLECTIONS.ORDER_STATES).updateOne(
      { orderHash: settlement.orderHash },
      {
        $set: {
          status: 'filled',
          updatedAt: settlement.block.timestamp,
        },
      },
      { upsert: true }
    ),
    db.collection(COLLECTIONS.SETTLEMENTS).insertOne({
      ...settlement,
      chainId: ingestion.chainId,
      ingestedAt: ingestion.ingestedAt,
    }),
  ])
}

import { getDb } from '#app/db/mongo.client'

// types
import { Settlement } from '../../domain/settlement.js'
import { IngestionContext } from '../types/context.js'

export const persist = async (settlement: Settlement, ingestion: IngestionContext) => {
  const db = getDb()

  await Promise.all([
    db.collection('order-states').updateOne(
      { orderHash: settlement.orderHash },
      {
        $set: {
          status: 'filled',
          updatedAt: settlement.block.timestamp,
        },
      },
      { upsert: true }
    ),
    db.collection('settlements').insertOne({
      ...settlement,
      chainId: ingestion.chainId,
      ingestedAt: ingestion.ingestedAt,
    }),
  ])
}

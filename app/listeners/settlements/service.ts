import { getDb } from '#app/db/mongo.client'

// types
import { Settlement } from '../../domain/settlement.js'
import { IngestionContext } from '../types/context.js'

export const persist = (settlement: Settlement, ingestion: IngestionContext) => {
  const db = getDb()

  db.collection('settlements').insertOne({
    ...settlement,
    chainId: ingestion.chainId,
    ingestedAt: ingestion.ingestedAt,
  })
}

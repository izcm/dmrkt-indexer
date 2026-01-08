import type { BlockRef, IngestionContext } from '@/listeners/types/context.js'

export type Settlement = {
  orderHash: string
  collection: string
  tokenId: string
  seller: string
  buyer: string
  currency: string
  priceWei: string
  txHash: string

  // metadata
  block: BlockRef
}

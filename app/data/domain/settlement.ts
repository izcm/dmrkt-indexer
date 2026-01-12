import { BlockRef } from '#app/listeners/types/context.js'

export type Settlement = {
  orderHash: string
  collection: `0x${string}`
  tokenId: string
  seller: `0x${string}`
  buyer: `0x${string}`
  currency: `0x${string}`
  priceWei: string
  txHash: string

  // metadata
  block: BlockRef
}

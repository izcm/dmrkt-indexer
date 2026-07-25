import { Decimal128 } from 'mongodb'

import type { NFT, NFTAttribute } from '#app/domain/nft/model.js'
import type { OrderRecord } from '#app/domain/order/model.js'
import type { Settlement } from '#app/domain/settlement/model.js'

// --- denormalized mongo docs ---

export type SettlementDoc = Settlement & {
  attributes?: NFTAttribute[] | null
  db: {
    price: Decimal128
    tokenId: string
  }
}

export type OrderDoc = OrderRecord & {
  attributes?: NFTAttribute[] | null
  db: {
    price: Decimal128
    start: number
    end: number
    tokenId: string
  }
}

export type NFTDoc = NFT & {
  db: {
    tokenId: string
  }
}

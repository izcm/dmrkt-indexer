import { BlockTime, TxContext } from '#app/listeners/types/context.js'
import type { Hex } from 'viem'

import { SideLabel } from './order.js'

export type Settlement = {
  orderHash: Hex
  collection: Hex
  tokenId: string
  seller: Hex
  buyer: Hex
  currency: Hex
  priceWei: string

  orderAttributes?: SettlementMeta['order']

  execution: {
    chainId: number
    logIndex: number
    txHash: Hex
    block: BlockTime
    txContext?: SettlementMeta['txContext']
  }

  metaStatus: 'DONE' | 'PENDING' | 'FAILED'
  metaError?: string
  ingestedAt: number
}

export type SettlementMeta = {
  order: {
    side: SideLabel
    signer: Hex
  }
  txContext: TxContext
}

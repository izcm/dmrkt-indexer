import { BlockTime, TxContext } from '#app/listeners/types/context.js'
import type { Hex } from 'viem'

export type Settlement = {
  orderHash: string
  collection: Hex
  tokenId: string
  seller: Hex
  buyer: Hex
  currency: Hex
  priceWei: string

  orderMeta?: SettlementMeta['order']

  execution: {
    chainId: number
    logIndex: number
    txHash: string
    block: BlockTime
    txContext?: SettlementMeta['txContext']
  }

  ingestedAt: number
}

export type SettlementMeta = {
  order: {
    side: 'ASK' | 'BID' | 'COLLECTION_BID'
    signer: Hex // if isEip1271 ? getSignerFromSignatureIGuess???
  }
  txContext: TxContext
}

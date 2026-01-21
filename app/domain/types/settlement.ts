import { BlockRef, TxMeta } from '#app/listeners/types/context.js'
import { Hex32 } from '#app/utils/format/hex32.js'

export type Settlement = {
  orderHash: string
  collection: Hex32
  tokenId: string
  seller: Hex32
  buyer: Hex32
  currency: Hex32
  priceWei: string
  txHash: string

  // metadata
  block: BlockRef
  txMeta?: TxMeta
}

export type SettlementMeta = {
  side: 'ASK' | 'BID' | 'COLLECTION_BID'
  signer?: Hex32 // if isEip1271 ? getSignerFromSignatureIGuess???
}

export type txMeta = {
  functionName: string
  functionSelector: string
  txIndex: number
  gasUsed: string
  effectiveGasPrice: string
  // validator ? could be nice
}

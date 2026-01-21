import { BlockRef, TxContext } from '#app/listeners/types/context.js'
import { Hex } from '#app/utils/format/hex.js'

export type Settlement = {
  orderHash: string
  collection: Hex
  tokenId: string
  seller: Hex
  buyer: Hex
  currency: Hex
  priceWei: string
  txHash: string

  block: BlockRef

  meta?: {
    side: 'ASK' | 'BID' | 'COLLECTION_BID'
    orderSigner: Hex // if isEip1271 ? getSignerFromSignatureIGuess???
    tx: TxContext
  }
}

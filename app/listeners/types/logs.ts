import { Hex32 } from '#app/utils/format/hex32.js'

export type SettlementLog = {
  eventName: 'Settlement'
  args: {
    orderHash: Hex32
    collection: Hex32
    tokenId: bigint
    seller: Hex32
    buyer: Hex32
    currency: Hex32
    price: bigint
  }
  blockNumber: bigint
  blockTimestamp: bigint
  transactionHash: Hex32
  logIndex: bigint
}

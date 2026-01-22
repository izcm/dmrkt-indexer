import type { Hex } from 'viem'

export type SettlementLog = {
  eventName: 'Settlement'
  args: {
    orderHash: Hex
    collection: Hex
    tokenId: bigint
    seller: Hex
    buyer: Hex
    currency: Hex
    price: bigint
  }
  blockNumber: bigint
  blockTimestamp: bigint
  transactionHash: Hex
  logIndex: bigint
}

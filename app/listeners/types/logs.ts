export type SettlementLog = {
  eventName: 'Settlement'
  args: {
    orderHash: `0x${string}`
    collection: `0x${string}`
    tokenId: bigint
    seller: `0x${string}`
    buyer: `0x${string}`
    currency: `0x${string}`
    price: bigint
  }
  blockNumber: bigint
  blockTimestamp: bigint
  transactionHash: `0x${string}`
  logIndex: bigint
}

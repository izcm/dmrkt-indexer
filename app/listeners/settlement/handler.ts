import { persist } from './service.js'

// types
import { SettlementLog } from '../types/logs.js'
import { ListenerItem } from '../types/context.js'

// domain types
import { Settlement } from '../../domain/settlement.js'

export function handleSettlement(item: ListenerItem) {
  const settlement = normalize(item.log)
  persist(settlement, item.ingestion)
}

const normalize = (log: SettlementLog): Settlement => {
  const { args } = log

  return {
    orderHash: args.orderHash,
    collection: args.collection,
    tokenId: args.tokenId.toString(),
    seller: args.seller,
    buyer: args.buyer,
    currency: args.currency,
    priceWei: args.price.toString(),
    txHash: log.transactionHash,
    block: {
      number: Number(log.blockNumber),
      timestamp: Number(log.blockTimestamp),
      logIndex: Number(log.logIndex),
    },
  }
}

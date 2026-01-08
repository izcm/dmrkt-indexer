import { parseAbi } from 'viem'

import { publicClient as client } from '#app/client'

import { handleSettlement } from './settlement/handler.js'
import { ListenerItem } from './types/context.js'

const target = '0xc80F9dA34212736BE29fcF9eD26B5951DDcc62Bb'

export const unwatch = client.watchEvent({
  address: target,
  events: parseAbi([
    'event Settlement(bytes32 indexed orderHash, address indexed collection, uint256 indexed tokenId, address seller, address buyer, address currency, uint256 price)',
  ]),
  onLogs: logs => {
    logs.forEach(log =>
      routeLog({ log, ingestion: { chainId: client.chain.id, ingestedAt: Date.now() } })
    )
  },
  onError: error => console.log(error),
})

const routers: Record<string, (item: ListenerItem) => void> = {
  Settlement: handleSettlement,
  // OrderCancelled: handleOrderCancelled,
}

const routeLog = (envelope: ListenerItem) => {
  const handler = routers[envelope.log.eventName]
  if (!handler) {
    console.warn(`[indexer] Unhandled event: ${envelope.log.eventName}`)
    return
  }

  handler(envelope)
}

console.log(`Listening to ${target}...`)

import { parseAbi } from 'viem'

import { SETTLEMENT_EVENT_EMITTER, VERIFYING_CONTRACT } from '#app/domain/constants/app.js'

import { publicClient as client } from '#app/rpc/client.js'

import { handle as handleSettlement } from './settlements/handler.js'
import { ListenerItem } from './types/context.js'

export const unwatch = client.watchEvent({
  address: SETTLEMENT_EVENT_EMITTER,
  events: parseAbi([
    'event Settlement(bytes32 indexed orderHash, address indexed collection, uint256 indexed tokenId, address seller, address buyer, address currency, uint256 price)',
  ]),
  onLogs: logs => {
    logs.forEach(log =>
      routeLog({
        log,
        chainId: client.chain.id,
      })
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

console.log(`🔔 Event listener started`)
console.log(`👁️  Watching contract: ${SETTLEMENT_EVENT_EMITTER}`)

// TODO: https://vitest.dev/config/ **define import aliases in vitest config**
import { describe, expect, it, vi } from 'vitest'

import { SettlementLog } from '#app/listeners/types/logs.js'
import { settlementFromLog } from '../logic.js'

describe('txMeta', () => {
  it('runs and logs stuff', async () => {
    const log = mockSettlementLog()

    const settlement = settlementFromLog(log, 1337)

    expect(settlement.orderHash).toBe(log.args.orderHash)
    expect(settlement.execution.chainId).toBe(1337)
  })
})

const mockSettlementLog = (): SettlementLog => {
  return {
    eventName: 'Settlement',
    args: {
      orderHash: '0xe73f658430c76c5dcf1f2c0421f434bbdcc9641b034cdaf152f3af3d69291ef2',
      collection: '0x123abc',
      tokenId: 0n,
      seller: '0xef',
      buyer: '0xbc',
      currency: '0xwei',
      price: 1n,
    },
    blockNumber: 24036654n,
    blockTimestamp: 0n,
    transactionHash: '0xe73f658430c76c5dcf1f2c0421f434bbdcc9641b034cdaf152f3af3d69291ef2',
    logIndex: 1n,
  }
}

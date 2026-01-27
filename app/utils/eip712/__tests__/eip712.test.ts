import { describe, expect, it, vi } from 'vitest'

import { privateKeyToAccount } from 'viem/accounts'
import { Abi, hashTypedData, Hex, recoverTypedDataAddress } from 'viem'

import { dmrktDomain, toOrder712, dmrktTypes } from '#app/utils/eip712/types.js'
import { OrderCore } from '#app/domain/types/order.js'

describe('eip712Utils', () => {
  it('toOrder712 converts correctly', () => {
    const o712 = toOrder712(order)

    expect(o712.tokenId).toBe(1n)
    expect(o712.price).toBe(100n)
    expect(o712.start).toBe(0n)
    expect(o712.end).toBe(9999999999n)
  })
})

const order: OrderCore = {
  side: 0,
  isCollectionBid: false,
  collection: '0x0000000000000000000000000000000000000001',
  tokenId: '1',
  currency: '0x0000000000000000000000000000000000000002',
  price: '100',
  actor: '0x1111111111111111111111111111111111111111',
  start: '0',
  end: '9999999999',
  nonce: '1',
}

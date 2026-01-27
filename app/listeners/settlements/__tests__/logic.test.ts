import json from '@a2zb/packages/abis/dmrkt/OrderEngine.json' with { type: 'json' }

// TODO: https://vitest.dev/config/ **define import aliases in vitest config**
import { describe, expect, it, vi } from 'vitest'

import { privateKeyToAccount } from 'viem/accounts'
import { Abi, encodeFunctionData, getAbiItem, Hex, parseSignature } from 'viem'

import { CHAIN_ID, SETTLEMENT_EVENT_EMITTER } from '#app/domain/constants/app.js'

import { SettlementLog } from '#app/listeners/types/logs.js'
import { settlementFromLog, settlementMetaFromTx } from '../logic.js'

import { OrderCore, Side, SideLabel } from '#app/domain/types/order.js'

import { dmrktDomain, toOrder712, dmrktTypes } from '#app/utils/eip712/types.js'

describe('settlement event parsing', () => {
  it('maps log args to Settlement fields', () => {
    const log = mockSettlementLog()
    const settlement = settlementFromLog(log, 31337)

    expect(settlement.orderHash).toBe(log.args.orderHash)
    expect(settlement.collection).toBe(log.args.collection)
    expect(settlement.tokenId).toBe(log.args.tokenId.toString())
    expect(settlement.execution.chainId).toBe(31337)
  })
})

describe('transaction context parsing', () => {
  it('extracts order meta from tx input', async () => {
    const abi = json.abi as Abi

    const settleFunc = getAbiItem({
      abi,
      name: 'settle',
    })

    expect(settleFunc).toBeDefined()

    // mock inputs
    const order = mockOrder()
    const signerAcount = privateKeyToAccount(mockPrivateKeys.orderActor) // doesn't need to match order.actor

    const sig = await signerAcount.signTypedData({
      domain: dmrktDomain,
      types: dmrktTypes,
      primaryType: 'Order',
      message: toOrder712(order),
    })

    const fill = mockFill()

    const encodedData = encodeFunctionData({
      abi,
      functionName: 'settle',
      args: [fill, order, parseSignature(sig)],
    })

    // mock chain ctx
    const tx = mockTx(encodedData)
    const receipt = mockReceipt

    // extract meta
    const meta = await settlementMetaFromTx(tx, receipt, abi)

    expect(meta.order.side).toBe(Side[order.side] as SideLabel)
    expect(meta.order.signer).toBe(signerAcount.address)
  })
})

const bytes32 = (byte: string) => ('0x' + byte.repeat(32)) as Hex
const addr = (byte: string) => ('0x' + byte.repeat(20)) as Hex

const mockPrivateKeys = {
  orderActor: bytes32('ab'),
}

const mockAddresses = {
  txTo: addr('11'),
  orderActor: addr('22'),
  fillActor: addr('33'),
  buyer: addr('44'),
  seller: addr('55'),
  currency: addr('66'),
  collection: addr('77'),
}

const mockTx = (input: Hex) => ({
  to: mockAddresses.txTo,
  chainId: 1n,
  transactionIndex: 0n,
  input,
})

const mockReceipt = {
  gasUsed: 1,
  effectiveGasPrice: 1,
}

const mockFill = () => ({ tokenId: 0n, actor: mockAddresses.fillActor })

const mockOrder = (): OrderCore => {
  return {
    side: 0,
    isCollectionBid: false,
    collection: mockAddresses.collection,
    tokenId: '1',
    currency: mockAddresses.currency,
    price: '100',
    actor: mockAddresses.orderActor,
    start: '0',
    end: '9999999999',
    nonce: '1',
  }
}

const mockSettlementLog = (): SettlementLog => {
  return {
    eventName: 'Settlement',
    args: {
      orderHash: bytes32('cd'),
      collection: mockAddresses.collection,
      tokenId: 1n,
      seller: mockAddresses.seller,
      buyer: mockAddresses.buyer,
      currency: mockAddresses.currency,
      price: 1n,
    },
    blockNumber: 1n,
    blockTimestamp: 0n,
    transactionHash: bytes32('xy'),
    logIndex: 0n,
  }
}

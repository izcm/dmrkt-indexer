import json from '@a2zb/packages/abis/dmrkt/OrderEngine.json' with { type: 'json' }

// TODO: https://vitest.dev/config/ **define import aliases in vitest config**
import { describe, expect, it, vi } from 'vitest'

import { privateKeyToAccount } from 'viem/accounts'
import { Abi, encodeFunctionData, getAbiItem, Hex, parseSignature } from 'viem'

import { SettlementLog } from '#app/listeners/types/logs.js'
import { settlementFromLog, settlementMetaFromTx } from '../logic.js'

import { Side, SideLabel } from '#app/domain/types/order.js'

import { dmrktDomain, toOrder712, dmrktTypes } from '#app/lib/blockchain/eip712.js'

// test helpers

import {
  mockPrivateKeys,
  mockSettlementLog,
  mockTx,
  mockReceipt,
  mockFill,
  mockOrder,
} from '#app/__test__/mocks/primitives.js'

describe('Settlement log => Settlement domain mapping', () => {
  it('creates a Settlement from a Settlement event log', () => {
    const log = mockSettlementLog()
    const settlement = settlementFromLog(log, 31337)

    // settlement data fields
    const { args } = log

    expect(settlement.orderHash).toBe(args.orderHash)

    expect(settlement.collection).toBe(args.collection)
    expect(settlement.tokenId).toBe(args.tokenId.toString())

    expect(settlement.seller).toBe(args.seller)
    expect(settlement.buyer).toBe(args.buyer)

    // chain / execution ctx
    const { execution } = settlement

    expect(execution.chainId).toBe(31337)

    expect(execution.logIndex).toBe(Number(log.logIndex))
    expect(execution.txHash).toBe(log.transactionHash)

    const { block } = execution

    expect(block.number).toBe(Number(log.blockNumber))
    expect(block.timestamp).toBe(Number(log.blockTimestamp))

    // ingestion ctx
    expect(settlement.metaStatus).toBe('PENDING')
    expect(settlement.ingestedAt).toBe(0) // set in db

    // order? should be undefined
    expect(settlement.orderMeta).toBeUndefined()
  })
})

describe('tx input => SettlementMeta extraction', () => {
  it('recovers signer + etc. order metadata ', async () => {
    const abi = json.abi as Abi

    const settleFunc = getAbiItem({
      abi,
      name: 'settle',
    })

    expect(settleFunc).toBeDefined()

    // mock inputs
    const order = mockOrder()
    const signerAcount = privateKeyToAccount(mockPrivateKeys.signer) // doesn't need to match order.actor

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

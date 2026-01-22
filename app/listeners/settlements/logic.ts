import { toFunctionSelector, decodeFunctionData, recoverPublicKey, serializeSignature } from 'viem'
import type { AbiFunction, Abi, Hex } from 'viem'

// order types & methods
import { OrderCore, OrderSignature, Side, SideLabel, hashOrder } from '#app/domain/types/order.js'

// context types
import { SettlementLog } from '../types/logs.js'

// domain types
import { Settlement, SettlementMeta } from '#app/domain/types/settlement.js'

export const settlementFromLog = (log: SettlementLog, chainId: number): Settlement => {
  const { args } = log

  return {
    orderHash: args.orderHash,
    collection: args.collection,
    tokenId: args.tokenId.toString(),
    seller: args.seller,
    buyer: args.buyer,
    currency: args.currency,
    priceWei: args.price.toString(),

    execution: {
      chainId: chainId,
      logIndex: Number(log.logIndex),
      txHash: log.transactionHash,

      block: {
        number: Number(log.blockTimestamp),
        timestamp: Number(log.blockNumber),
      },
    },

    ingestedAt: 0,
  }
}

export const settlementMetaFromTx = async (
  tx: any,
  receipt: any,
  abi: Abi
): Promise<SettlementMeta> => {
  if (!tx.to) {
    throw new Error('Unexpected contract creation tx')
  }

  const selector = tx.input.slice(0, 10) as Hex

  const fnMatch = abi.find(
    (x): x is AbiFunction => x.type === 'function' && toFunctionSelector(x) === selector
  )

  if (!fnMatch) {
    throw new Error('No match: given abi has no match for tx function selector')
  }

  const { args } = decodeFunctionData({
    abi,
    data: tx.input,
  })

  if (!args) {
    throw new Error('No args found when parsing tx.inputs')
  }

  const [, order, sig] = args as [unknown, OrderCore, OrderSignature]

  if (!order || !sig) {
    throw new Error('Malformed args: error parsing ORDER or SIGNATURE')
  }

  const oHash = hashOrder(order)

  const signer = await recoverPublicKey({
    hash: oHash,
    signature: serializeSignature({ r: sig.r as Hex, s: sig.s as Hex, v: BigInt(sig.v) }),
  })

  return {
    order: {
      side: Side[order.side] as SideLabel,
      signer: signer,
    },
    txContext: {
      index: tx.transactionIndex,
      gasUsed: receipt.gasUsed.toString(),
      effectiveGasPrice: receipt.effectiveGasPrice.toString(),
      functionSelector: tx.input.slice(0, 10) as `0x${string}`,
      functionName: fnMatch.name,
      contractAddress: tx.to,
    },
  }
}

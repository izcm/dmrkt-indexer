import json from '@a2zb/packages/abis/dmrkt/OrderEngine.json' with { type: 'json' }

import { toFunctionSelector, recoverPublicKey, decodeFunctionData, Abi, AbiFunction } from 'viem'

import { publicClient as client } from '#app/client.js'
import type { Hex } from 'viem'

import { TxContext } from './types/context.js'

const RPC_URL = process.env.RPC_URL

//export const txMeta = async <T>(txHash: Hex32, normalize: () => T) => {

export const getTxMeta = async (txHash: Hex): Promise<TxContext> => {
  const tx = await client.getTransaction({ hash: txHash })
  const receipt = await client.getTransactionReceipt({ hash: txHash })

  const abi = json.abi as Abi

  const abiFunctionMatch = abi.find(
    (x): x is AbiFunction =>
      x.type === 'function' && toFunctionSelector(x) === (tx.input.slice(0, 10) as `0x${string}`)
  )

  if (!abiFunctionMatch) {
    throw new Error('No ABI function match for tx function selector')
  }

  if (!tx.to) {
    throw new Error('Unexpected contract creation tx')
  }

  return {
    index: tx.transactionIndex,
    gasUsed: receipt.gasUsed.toString(),
    effectiveGasPrice: receipt.effectiveGasPrice.toString(),
    functionSelector: tx.input.slice(0, 10) as `0x${string}`,
    functionName: abiFunctionMatch.name,
    contractAddress: tx.to,
  }
}

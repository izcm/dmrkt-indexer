import { Hex } from 'viem'

import { publicClient as client } from '#app/rpc/client.js'

const RPC_URL = process.env.RPC_URL

export const getTxMeta = async (txHash: Hex): Promise<{ tx: any; receipt: any }> => {
  const tx = await client.getTransaction({ hash: txHash })
  const receipt = await client.getTransactionReceipt({ hash: txHash })

  return {
    tx,
    receipt,
  }
}

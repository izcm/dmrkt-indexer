import json from '@a2zb/packages/abis/dmrkt/OrderEngine.json' with { type: 'json' }

import type { Abi, Hex } from 'viem'

// db and rpc stuff
import { settlementRepo } from '#app/repos/settlement.repo.js'
import { getTxMeta } from '#app/rpc/tx-meta.js'

import { ListenerItem } from '../types/context.js'

// pure methods
import { settlementFromLog, settlementMetaFromTx } from './logic.js'

export function handle(item: ListenerItem) {
  const settlement = settlementFromLog(item.log, item.chainId)
  settlementRepo.save(settlement)

  void enrich(item.log.transactionHash)
}

const enrich = async (txHash: Hex) => {
  const { receipt, tx } = await getTxMeta(txHash)
  const meta = await settlementMetaFromTx(tx, receipt, json.abi as Abi)
  await settlementRepo.updateWithMeta(txHash, meta)
}

import json from '@a2zb/packages/abis/dmrkt/OrderEngine.json' with { type: 'json' }
import type { Abi } from 'viem'

import { getTxMeta } from '#app/rpc/tx-meta.js'
import { settlementRepo } from '#app/repos/settlement.repo.js'

import { settlementMetaFromTx } from '#app/listeners/settlements/logic.js'
import { DEFAULT_PAGE_LIMIT } from '#app/domain/constants/api.js'

export const runSettlementWorker = async () => {
  const pending = await settlementRepo.findPendingMeta(25)

  if (pending.length === 0) return

  for (const s of pending) {
    try {
      const txHash = s.execution.txHash

      const { receipt, tx } = await getTxMeta(txHash)

      const meta = await settlementMetaFromTx(tx, receipt, json.abi as Abi)

      await settlementRepo.markMetaDone(txHash, meta)
    } catch (err: any) {
      console.log('[meta-worker] failed for ', s._id, err.message)
      await settlementRepo.markMetaFailed(s.execution.txHash, err.message)
    }
  }
}

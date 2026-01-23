import { runSettlementWorker as runSettlementMetaWorker } from './settlement-meta.worker.js'

export const start = () => {
  setInterval(async () => {
    try {
      await runSettlementMetaWorker()
    } catch (e) {
      console.error('[workers] meta worker crashed', e)
    }
  }, 10_000)
}

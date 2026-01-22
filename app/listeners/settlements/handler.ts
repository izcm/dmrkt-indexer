import { save, updateWithMeta } from './service.js'
import { getTxMeta } from '../tx-meta.service.js'

// context types
import { SettlementLog } from '../types/logs.js'
import { ListenerItem, TxContext } from '../types/context.js'

// domain types
import { Settlement, SettlementMeta } from '#app/domain/types/settlement.js'
import { Hex } from 'viem'

export function handle(item: ListenerItem) {
  const settlement = toSettlement(item.log, item.chainId)
  save(settlement)

  void enrich(item.log.transactionHash)
}

const enrich = async (txHash: Hex) => {
  const txCtx = await getTxMeta(txHash)

  const meta = toSettlementMeta(txCtx)
  await updateWithMeta(txHash, meta)
}

const toSettlement = (log: SettlementLog, chainId: number): Settlement => {
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

    ingestedAt: Date.now(),
  }
}

const toSettlementMeta = (txCtx: TxContext): SettlementMeta => {
  return {
    order: {
      side: 'ASK',
      signer: '0xfe',
    },
    txContext: txCtx,
  }
}

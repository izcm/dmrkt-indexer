// === SHARED METADATA WRAPPERS ===

import { Hex32 } from '#app/utils/format/hex32.js'

export type ListenerItem = {
  log: any // decoded viem log
  ingestion: IngestionContext
}

export type IngestionContext = {
  chainId: number
  ingestedAt: number
}

export type BlockRef = {
  chainId: number
  number: number // monotonic counter => safely store as js number
  timestamp: number // UNIX timestamp
  logIndex: number // safe cast
  proposer?: Hex32
}

export type TxRef = {
  hash: Hex32
  index: number
}

export type TxMeta = {
  gasUsed: string
  effectiveGasPrice: string
  functionSelector: string
  functionName: string
}

// === SHARED METADATA WRAPPERS ===

import { Hex } from '#app/utils/format/hex.js'

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
}

export type TxContext = {
  index: number
  gasUsed: string
  effectiveGasPrice: string
  functionSelector: `0x${string}`
  functionName: string
  contractAddress: Hex | null
}

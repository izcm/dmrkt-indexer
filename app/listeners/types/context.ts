// === SHARED METADATA WRAPPERS ===

export type ListenerItem = {
  log: any // decoded viem log
  ingestion: IngestionContext
}

export type IngestionContext = {
  chainId: number
  ingestedAt: number
}

export type BlockRef = {
  number: number // monotonic counter => safely store as js number
  timestamp: number // UNIX timestamp
  logIndex: number // safe cast
}

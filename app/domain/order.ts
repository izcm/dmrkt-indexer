export type Order = {
  actor: string
  collection: string
  currency: string
  price: string
  nonce: string
  side: number
  start: number
  end: number
  tokenId: string
  isCollectionBid: boolean
  signature: {
    r: string
    s: string
    v: number
  }
}

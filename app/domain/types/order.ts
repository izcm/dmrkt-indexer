import { encodeAbiParameters, keccak256, toBytes, zeroAddress } from 'viem'
import type { Hex } from 'viem'

export enum Side {
  ASK,
  BID,
  COLLECTION_BID,
}

export type SideLabel = keyof typeof Side

export type OrderRecord = {
  orderHash: Hex // = orderHash
  chainId: number
  order: Order
}

export type Order = {
  side: number
  isCollectionBid: boolean
  collection: Hex
  tokenId: string
  currency: Hex
  price: string
  actor: Hex
  // end & start = user input => don't cast to number
  start: string
  end: string
  nonce: string

  signature: {
    r: Hex
    s: Hex
    v: number
  }
}

export const hashOrderStruct = (o: OrderCore): Hex => {
  const encoded = encodeAbiParameters(
    [
      { type: 'bytes32' },
      { type: 'uint8' },
      { type: 'bool' },
      { type: 'address' },
      { type: 'uint256' },
      { type: 'address' },
      { type: 'uint256' },
      { type: 'address' },
      { type: 'uint64' },
      { type: 'uint64' },
      { type: 'uint256' },
    ],
    [
      ORDER_TYPE_HASH(),
      o.side,
      o.isCollectionBid,
      o.collection,
      BigInt(o.tokenId),
      o.currency,
      BigInt(o.price),
      o.actor,
      BigInt(o.start),
      BigInt(o.end),
      BigInt(o.nonce),
    ]
  )

  return keccak256(encoded)
}

const ORDER_TYPE_HASH = () =>
  keccak256(
    toBytes(
      'Order(uint8 side,bool isCollectionBid,address collection,uint256 tokenId,address currency,uint256 price,address actor,uint64 start,uint64 end,uint256 nonce)'
    )
  )

export type OrderCore = Omit<Order, 'signature'>
export type OrderSignature = Order['signature']

export const validOrder = (o: Order): boolean => {
  return (
    BigInt(o.price) > 0 &&
    BigInt(o.end) > BigInt(o.start) &&
    // commented out since the demo includes fork time-warping
    // BigInt(o.end) >= Math.floor(Date.now() / 1000) &&
    o.actor !== zeroAddress
  )
}

import { encodeAbiParameters, keccak256, toBytes, zeroAddress } from 'viem'
import type { Hex } from 'viem'

export type Order = {
  actor: Hex
  collection: Hex
  currency: Hex
  price: string
  nonce: string
  side: number
  // end & start = user input => don't cast to number
  start: string
  end: string
  tokenId: string
  isCollectionBid: boolean
  signature: {
    r: string
    s: string
    v: number
  }
}

export const validOrder = (o: Order): boolean => {
  console.log(`price valid: ${BigInt(o.price) > 0}`)
  console.log(`time window: ${BigInt(o.end) > BigInt(o.start)}`)
  console.log(`end valid: ${BigInt(o.end) >= Date.now()}`)
  console.log(`actor valid: ${o.actor !== zeroAddress}`)

  return (
    BigInt(o.price) > 0 &&
    BigInt(o.end) > BigInt(o.start) &&
    BigInt(o.end) >= Math.floor(Date.now() / 1000) &&
    o.actor !== zeroAddress
  )
}

export const hashOrder = (o: Order): Hex => {
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

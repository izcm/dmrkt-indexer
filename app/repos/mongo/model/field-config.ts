import { Decimal128 } from 'mongodb'

export type FieldConfig = Record<
  string,
  {
    dbField: string
    toDb?: (v: string) => unknown
  }
>

export const padTokenId = (v: string) => v.padStart(78, '0')

export const SETTLEMENT_FIELD_TRANSFORMS: FieldConfig = {
  price: {
    dbField: 'db.price',
    toDb: (v: string) => Decimal128.fromString(v),
  },
  tokenId: {
    dbField: 'db.tokenId',
    toDb: padTokenId,
  },
}

export const NFT_FIELD_TRANSFORMS: FieldConfig = {
  tokenId: {
    dbField: 'db.tokenId',
    toDb: padTokenId,
  },
}

export const ORDER_FIELD_TRANSFORMS: FieldConfig = {
  'order.tokenId': {
    dbField: 'db.tokenId', // padded tokenId
    toDb: padTokenId,
  },
  'order.price': {
    dbField: 'db.price',
    toDb: (v: string) => Decimal128.fromString(v),
  },
  'order.start': {
    dbField: 'db.start',
    toDb: (v: string) => Number(v),
  },
  'order.end': {
    dbField: 'db.end',
    toDb: (v: string) => Number(v),
  },
}

export const ORDER_OR_FIELDS = new Set(['order.tokenId', 'order.side'])

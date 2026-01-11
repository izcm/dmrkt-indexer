const addrRegex = '^0x[a-fA-F0-9]{40}$'

export const orderQueryableFields = {
  actor: { type: 'string', pattern: addrRegex },
  collection: { type: 'string', pattern: addrRegex },
  currency: { type: 'string', pattern: addrRegex },
  price: { type: 'string' },
  nonce: { type: 'string' },
  side: { type: 'integer', minimum: 0 },
  start: { type: 'integer', minimum: 0 },
  end: { type: 'integer', minimum: 0 },
  tokenId: { type: 'string' },
  isCollectionBid: { type: 'boolean' },
}

export const orderCreateBody = {
  $id: 'order-create',
  type: 'object',
  required: [
    'actor',
    'collection',
    'currency',
    'price',
    'nonce',
    'side',
    'start',
    'end',
    'tokenId',
    'isCollectionBid',
    'signature',
  ],
  properties: {
    ...orderQueryableFields,
    signature: {
      type: 'object',
      required: ['r', 's', 'v'],
      properties: {
        r: { type: 'string' },
        s: { type: 'string' },
        v: { type: 'integer', minimum: 27, maximum: 28 },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
} as const

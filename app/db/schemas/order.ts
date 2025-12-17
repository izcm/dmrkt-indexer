export const OrderSchema = {
  $id: 'order',
  type: 'object',
  required: ['actor', 'collection', 'currency', 'price', 'nonce', 'side', 'signature'],
  properties: {
    actor: { type: 'string' },
    collection: { type: 'string' },
    currency: { type: 'string' },

    price: { type: 'string' },
    nonce: { type: 'string' },
    side: { type: 'integer' },

    start: { type: 'integer' },
    end: { type: 'integer' },
    tokenId: { type: 'string' },

    isCollectionBid: { type: 'boolean' },

    signature: {
      type: 'object',
      required: ['r', 's', 'v'],
      properties: {
        r: { type: 'string' },
        s: { type: 'string' },
        v: { type: 'integer' },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
} as const

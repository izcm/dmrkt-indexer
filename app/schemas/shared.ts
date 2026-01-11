export const paginationQueryParams = {
  limit: { type: 'integer', minimum: 1, maximum: 100 },
  cursor: { type: 'string', pattern: '^[0-9]+_[a-fA-F0-9]{24}$' },
}

export const byIdParams = {
  type: 'object',
  required: ['id'],
  additionalProperties: false,
  properties: {
    id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
  },
} as const

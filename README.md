# dmrkt-indexer

Minimal indexer for d|mrkt.

This service ingests signed orders over HTTP, verifies them, normalizes the data,
and stores them in MongoDB.

No frontend.
No UI.
No magic.

## Responsibilities

- Receive signed orders via HTTP (`POST /orders`)
- Verify EIP-712 signatures
- Normalize order data
- Persist orders in MongoDB

## Tech Stack

- Node.js
- TypeScript
- viem (EVM interactions & signature verification)
- Fastify (HTTP server)
- MongoDB (via Mongoose)

## Development

```bash
npm install
npm run dev
```

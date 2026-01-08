# dmrkt-indexer

Minimal indexer for d|mrkt.

This service ingests signed orders over HTTP, verifies them, normalizes the data,
and stores them in MongoDB.

## Responsibilities

- Receive signed orders via HTTP (`POST /orders`)
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

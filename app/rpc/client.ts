import { createPublicClient, http } from 'viem'
import { anvil } from 'viem/chains'

const RPC_URL = process.env.RPC_URL

export const publicClient = createPublicClient({
  chain: anvil,
  transport: http(RPC_URL),
})

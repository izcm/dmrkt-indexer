import { createPublicClient, http } from 'viem'
import { anvil } from 'viem/chains'

const ANVIL_RPC_URL = process.env.ANVIL_RPC_URL

export const publicClient = createPublicClient({
  chain: anvil,
  transport: http(ANVIL_RPC_URL),
})

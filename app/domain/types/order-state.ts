export type OrderStatus = 'active' | 'filled' | 'cancelled' | 'expired'

// if duplicate chainid + orderHash
//  1. reused nonce => error

export type OrderState = {
  chainId: number
  orderHash: string
  status: OrderStatus
  updatedAt: number
}

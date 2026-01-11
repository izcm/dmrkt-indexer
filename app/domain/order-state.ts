type OrderStatus = 'active' | 'filled' | 'cancelled' | 'expired'

export type OrderState = {
  orderHash: string
  status: OrderStatus
  updatedAt: number
}

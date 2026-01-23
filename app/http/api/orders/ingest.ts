import { FastifyInstance } from 'fastify'

import { API_ERRORS } from '#app/domain/constants/api.js'

import { Order, hashOrder, validOrder } from '#app/domain/types/order.js'
import { orderRepo as repo } from '#app/repos/order.repo.js'

// TODO: index orderhash on `order_status`
export const ordersIngest = (fastify: FastifyInstance) => {
  fastify.post<{ Body: Order }>(
    '/',
    { schema: { body: { $ref: 'order-create#' } } },
    async (req, res) => {
      if (!validOrder(req.body as Order)) {
        res.code(400)
        return API_ERRORS.INVALID_ORDER
      }

      const order = req.body as Order

      const { insertedId } = await repo.save(order)

      res.code(201).header('Location', `/api/orders/${insertedId}`)

      return insertedId
    }
  )
}

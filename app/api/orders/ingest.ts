import { FastifyInstance } from 'fastify'

import { COLLECTIONS } from '#app/domain/constants/db.js'
import { API_ERRORS } from '#app/domain/constants/api.js'

import { Order, hashOrder, validOrder } from '#app/domain/types/order.js'

// TODO: index orderhash on `order_status`
export const ordersIngest = (fastify: FastifyInstance) => {
  const dbOrders = fastify.mongo.db?.collection(COLLECTIONS.ORDERS)
  const dbOrderStates = fastify.mongo.db?.collection(COLLECTIONS.ORDER_STATES)

  if (!dbOrders || !dbOrderStates) throw new Error('Could not find db orders')

  fastify.post<{ Body: Order }>(
    '/',
    { schema: { body: { $ref: 'order-create#' } } },
    async (req, res) => {
      if (!validOrder(req.body as Order)) {
        console.log('FUCK EVERYTHING')
        res.code(400)
        return API_ERRORS.INVALID_ORDER
      }

      const { insertedId } = await dbOrders.insertOne(req.body)

      // create order_state
      await dbOrderStates.insertOne({
        orderHash: hashOrder(req.body as Order),
        status: 'active',
        updatedAt: Date.now(),
      })

      res.code(201).header('Location', `/api/orders/${insertedId}`)

      return { id: insertedId }
    }
  )
}

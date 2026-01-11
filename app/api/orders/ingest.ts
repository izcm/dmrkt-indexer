import { FastifyInstance } from 'fastify'
import { hashOrder, Order } from '#app/domain/order'

// TODO: index orderhash on `order_status`
export const ordersIngest = (fastify: FastifyInstance) => {
  const dbOrders = fastify.mongo.db?.collection('orders')
  const dbOrderStates = fastify.mongo.db?.collection('order_states')

  if (!dbOrders || !dbOrderStates) throw new Error('Could not find db orders')

  fastify.post<{ Body: Order }>(
    '/',
    { schema: { body: { $ref: 'order-create#' } } },
    async (req, res) => {
      // TODO: make rules eg. end > start && start >= now() etc. validation rules before insert
      const { insertedId } = await dbOrders.insertOne(req.body)

      // create order_status doc
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

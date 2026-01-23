import { ObjectId } from 'mongodb'

import { getDb } from '#app/db/mongo.js'
import { COLLECTIONS } from '#app/domain/constants/db.js'
import { FindPageArgs } from '#app/repos/types.js'
import { hashOrder, Order } from '#app/domain/types/order.js'

const dbOrders = () => {
  const db = getDb()
  return db.collection(COLLECTIONS.ORDERS)
}

const dbOrderStates = () => {
  const db = getDb()
  return db.collection(COLLECTIONS.ORDER_STATES)
}

export const orderRepo = {
  // === read ===
  async findById(id: ObjectId) {
    return dbOrders().findOne({ _id: id })
  },

  async findPage({ filters, from, to, cursor, limit }: FindPageArgs) {
    const query = { ...filters }

    if (cursor) {
      // todo: implement cursor with some timestamp
      const [ts, id] = cursor.split('_')
    }

    const docs = await dbOrders()
      .find(query)
      // .sort({ [blockTs]: -1, _id: -1 })
      .limit(limit + 1)
      .toArray()

    let nextCursor: string | null = null

    if (docs.length > limit) {
      const last = docs[limit - 1]
      nextCursor = `${last.execution.block.timestamp}_${last._id.toString()}`
    }

    return {
      items: docs.slice(0, limit),
      nextCursor,
    }
  },

  // === write ===
  async save(order: Order) {
    const { signature, ...orderCore } = order

    // create order_state
    await dbOrderStates().insertOne({
      orderHash: hashOrder(orderCore),
      status: 'active',
      updatedAt: Date.now(),
    })

    return dbOrders().insertOne({
      ...orderCore,
      signature,
    })
  },
}

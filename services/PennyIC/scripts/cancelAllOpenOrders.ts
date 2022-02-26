require('dotenv').config({ path: '../../../.env' })

import * as tradier from '@penny/tradier'


const cancelAllOpenOrders = async () => {
  const orders = await tradier.getOrders()
  const openOrderIds = orders.filter(x => [ 'open', 'pending' ].includes(x.status))
    .map(x => x.id)
  await tradier.cancelOrders(openOrderIds)
  console.log('Cancelled Orders')
}

cancelAllOpenOrders()
import * as tradier from '@penny/tradier'


const closeOldOrders = async () => {
  const orders = await tradier.getOrders()
  const buyToOpenOrders = orders.filter(ord => ord.side === 'buy_to_open' && ord.class === 'option' && ord.status === 'open')

  if (buyToOpenOrders.length === 0) {
    return
  }

  const ids = buyToOpenOrders.map(ord => ord.id)
  await tradier.cancelOrders(ids)
}


export {
  closeOldOrders
}
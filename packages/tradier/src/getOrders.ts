import { isOption, getType } from '@penny/option-symbol-parser'
import { callTradierHelper } from './callTradierHelper'

export type OrderType = 'market' | 'limit' | 'stop' | 'stop_limit' | 'debit' | 'credit' | 'even'
export type OrderSide = 'buy' | 'buy_to_cover' | 'sell' | 'sell_short' | 'buy_to_open' | 'buy_to_close' | 'sell_to_open' | 'sell_to_close'
export type OrderStatus = 'open' | 'partially_filled' | 'filled' | 'expired' | 'canceled' | 'pending' | 'rejected' | 'error'
export type OrderDuration = 'day' | 'pre' | 'post' | 'gtc'
export type OrderClass = 'equity' | 'option' | 'combo' | 'multileg'

export type OrderLeg = {
  id: number,
  symbol: string,
  option_symbol?: string,
  type: OrderType,
  side: OrderSide,
  quantity: number,
  status: OrderStatus,
  duration: OrderDuration,
  price: number,
  class: OrderClass
}
export type Order = OrderLeg & {
  leg?: OrderLeg[]
}


export const filterForCoveredCallOrders = (orders: Order[]) : Order[] =>
  orders.filter(ord =>
    ord.class === 'option'
    && [ 'open', 'partially_filled', 'pending', 'calculated', 'accepted_for_bidding', 'held' ].includes(ord.status)
    && ord.side === 'sell_to_open'
    && getType(ord.option_symbol) === 'call'
  )


export const filterForCashSecuredPutOrders = (orders: Order[]) : Order[] =>
  orders.filter(ord =>
    ord.class === 'option'
    && [ 'open', 'partially_filled', 'pending', 'calculated', 'accepted_for_bidding', 'held' ].includes(ord.status)
    && ord.side === 'sell_to_open'
    && getType(ord.option_symbol) === 'put'
  )


export const filterForOptionBuyToCloseOrders = (orders: Order[]) : Order[] =>
  orders.filter(ord =>
    ord.class === 'option'
    && [ 'open', 'partially_filled', 'pending', 'calculated', 'accepted_for_bidding', 'held' ].includes(ord.status)
    && ord.side === 'buy_to_close'
    && isOption(ord.option_symbol)
  )


export const getOrder = async (orderId: number) : Promise<Order> =>
  callTradierHelper(`accounts/${process.env.ACCOUNTNUM}/orders/${orderId}`, 'order', null, false)



export const getOrders = async () : Promise<Order[]> =>
  callTradierHelper(`accounts/${process.env.ACCOUNTNUM}/orders`, 'orders', 'order', true)


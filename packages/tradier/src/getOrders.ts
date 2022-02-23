import * as network from './network'
import { isOption, getType } from '@penny/option-symbol-parser'

export type OrderType = 'market' | 'limit' | 'stop' | 'stop_limit' | 'debit' | 'credit' | 'even'
export type OrderSide = 'buy' | 'buy_to_cover' | 'sell' | 'sell_short' | 'buy_to_open' | 'buy_to_close' | 'sell_to_open' | 'sell_to_close'
export type OrderStatus = 'open' | 'partially_filled' | 'filled' | 'expired' | 'canceled' | 'pending' | 'rejected' | 'error'
export type OrderDuration = 'day' | 'pre' | 'post' | 'gtc'
export type OrderClass = 'equity' | 'option' | 'combo' | 'multileg'

export type OrderLeg = Order
export type Order = {
  id: number,
  symbol: string,
  option_symbol?: string,
  type: OrderType,
  side: OrderSide,
  quantity: number,
  status: OrderStatus,
  duration: OrderDuration,
  price: number,
  class: OrderClass,
  leg?: Order[]
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


export const getOrder = async (orderId: number) : Promise<Order> => {
  const url = `accounts/${process.env.ACCOUNTNUM}/orders/${orderId}`
  const response = await network.get(url)
  if (response.order === 'null') {
    return null
  }
  return response.order
}


export const getOrders = async () : Promise<Order[]> => {
  const url = `accounts/${process.env.ACCOUNTNUM}/orders`
  const response = await network.get(url)
  if (response.orders === 'null') {
    return []
  }
  if (Array.isArray(response.orders.order)) {
    return response.orders.order
  } else {
    return [ response.orders.order ]
  }
}

import * as network from './network'
import { isOption, getType } from '@penny/option-symbol-parser'


export const filterForCoveredCallOrders = orders =>
  orders.filter(ord =>
    ord.class === 'option'
    && [ 'open', 'partially_filled', 'pending', 'calculated', 'accepted_for_bidding', 'held' ].includes(ord.status)
    && ord.side === 'sell_to_open'
    && getType(ord.option_symbol) === 'call'
  )


export const filterForCashSecuredPutOrders = orders =>
  orders.filter(ord =>
    ord.class === 'option'
    && [ 'open', 'partially_filled', 'pending', 'calculated', 'accepted_for_bidding', 'held' ].includes(ord.status)
    && ord.side === 'sell_to_open'
    && getType(ord.option_symbol) === 'put'
  )


export const filterForOptionBuyToCloseOrders = orders =>
  orders.filter(ord =>
    ord.class === 'option'
    && [ 'open', 'partially_filled', 'pending', 'calculated', 'accepted_for_bidding', 'held' ].includes(ord.status)
    && ord.side === 'buy_to_close'
    && isOption(ord.option_symbol)
  )


export const getOrder = async orderId => {
  const url = `accounts/${process.env.ACCOUNTNUM}/orders/${orderId}`
  const response = await network.get(url)
  if (response.order === 'null') {
    return null
  }
  return response.order
}


export const getOrders = async () => {
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

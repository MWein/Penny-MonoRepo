import * as network from './network'
import * as logUtil from '@penny/logger'
import { chunk } from 'lodash'


export const _sendOrder = async (body: object, successLog: string, failureLog: string) => {
  const url = `accounts/${process.env.ACCOUNTNUM}/orders`

  const bodyWithAccountId = {
    account_id: process.env.ACCOUNTNUM,
    ...body,
  }

  try {
    const result = await network.post(url, bodyWithAccountId, false)
    logUtil.log(successLog)
    return result
  } catch (e) {
    logUtil.log({
      type: 'error',
      message: failureLog,
    })
    logUtil.log({
      type: 'error',
      message: e.message,
    })
    return {
      status: 'not ok'
    }
  }
}


export const buy = async (symbol: string, quantity: number) => {
  const body = {
    class: 'equity',
    symbol,
    side: 'buy',
    quantity,
    type: 'market',
    duration: 'day',
  }
  const result = await _sendOrder(
    body,
    `Buy ${quantity} ${symbol}`,
    `Buy ${quantity} ${symbol} Failed`
  )
  return result
}


export const buyToOpen = async (symbol: string, option_symbol: string, quantity: number, limitPrice: number) => {
  const body = {
    class: 'option',
    symbol,
    option_symbol,
    side: 'buy_to_open',
    quantity,
    type: 'limit',
    price: limitPrice,
    duration: 'day',
  }
  const result = await _sendOrder(
    body,
    `Buy-to-open ${quantity} ${symbol}`,
    `Buy-to-open ${quantity} ${symbol} Failed`
  )
  return result
}


export const sellToOpen = async (symbol: string, option_symbol: string, quantity: number) => {
  const body = {
    class: 'option',
    symbol,
    option_symbol,
    side: 'sell_to_open',
    quantity,
    type: 'market',
    duration: 'day',
  }

  const result = await _sendOrder(
    body,
    `Sell-to-open ${quantity} ${option_symbol}`,
    `Sell-to-open ${quantity} ${option_symbol} Failed`
  )
  return result
}


export const sellToClose = async (symbol: string, option_symbol: string, quantity: number) => {
  const body = {
    class: 'option',
    symbol,
    option_symbol,
    side: 'sell_to_close',
    quantity,
    type: 'market',
    duration: 'gtc',
  }

  const result = await _sendOrder(
    body,
    `Sell-to-close ${quantity} ${option_symbol}`,
    `Sell-to-close ${quantity} ${option_symbol} Failed`
  )
  return result
}


export const sellToCloseLimit = async (symbol: string, option_symbol: string, quantity: number, price: number) => {
  const body = {
    class: 'option',
    symbol,
    option_symbol,
    side: 'sell_to_close',
    quantity,
    type: 'limit',
    price,
    duration: 'gtc',
  }

  const result = await _sendOrder(
    body,
    `Sell-to-close ${quantity} ${option_symbol}`,
    `Sell-to-close ${quantity} ${option_symbol} Failed`
  )
  return result
}


export const buyToClose = async (
  symbol: string,
  option_symbol: string,
  quantity: number,
  buyToCloseAmount: number
) => {
  const body = {
    class: 'option',
    symbol,
    option_symbol,
    side: 'buy_to_close',
    quantity,
    type: 'limit',
    price: buyToCloseAmount,
    duration: 'gtc',
  }

  const result = await _sendOrder(
    body,
    `Buy-to-close ${quantity} ${option_symbol}`,
    `Buy-to-close ${quantity} ${option_symbol} Failed`
  )
  return result
}


export const buyToCloseMarket = async (symbol: string, option_symbol: string, quantity: number) => {
  const body = {
    class: 'option',
    symbol,
    option_symbol,
    side: 'buy_to_close',
    quantity,
    type: 'market',
    duration: 'gtc',
  }

  const result = await _sendOrder(
    body,
    `Buy-to-close Market Price ${quantity} ${option_symbol}`,
    `Buy-to-close Market Price ${quantity} ${option_symbol} Failed`
  )
  return result
}


export type MultilegOptionType = 'market' | 'debit' | 'credit' | 'even'
export type OptionOrderSide = 'buy_to_open' | 'buy_to_close' | 'sell_to_open' | 'sell_to_close'
export type MultilegOptionLeg = {
  symbol: string,
  side: OptionOrderSide,
  quantity: number,
}

export const multilegOptionOrder = async (
  underlying: string,
  type: MultilegOptionType,
  legs: MultilegOptionLeg[],
  price: number = 0.07
) => {
  const mainBody = {
    class: 'multileg',
    symbol: underlying,
    type,
    duration: 'day',
    price,
  }

  const bodyWithLegs = legs.reduce((acc, leg, index) => {
    const optionSymbolKey = `option_symbol[${index}]`
    const sideKey = `side[${index}]`
    const quantityKey = `quantity[${index}]`

    return {
      ...acc,
      [optionSymbolKey]: leg.symbol,
      [sideKey]: leg.side,
      [quantityKey]: leg.quantity,
    }
  }, mainBody)

  const result = await _sendOrder(
    bodyWithLegs,
    `Multileg Order ${underlying}`,
    `Multileg Order ${underlying} Failed`
  )
  return result
}


export const cancelOrders = async (orderIDs: number[]) => {
  const chunks = chunk(orderIDs, 50)

  for (let x = 0; x < chunks.length; x++) {
    const chunk = chunks[x]

    await Promise.all(chunk.map(async orderId => {
      const url = `accounts/${process.env.ACCOUNTNUM}/orders/${orderId}`
      try {
        await network.deleteReq(url)
      } catch (e) {
        logUtil.log({
          type: 'error',
          message: `Could not cancel ${orderId}`,
        })
      }
    }))
  }
}

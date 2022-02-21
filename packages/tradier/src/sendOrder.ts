import * as network from './network'
import * as logUtil from '@penny/logger'


export const buy = async (symbol: string, quantity: number) => {
  const url = `accounts/${process.env.ACCOUNTNUM}/orders`

  const body = {
    account_id: process.env.ACCOUNTNUM,
    class: 'equity',
    symbol,
    side: 'buy',
    quantity,
    type: 'market',
    duration: 'day',
  }

  try {
    const result = await network.post(url, body, false)
    logUtil.log(`Buy ${quantity} ${symbol}`)
    return result
  } catch (e) {
    logUtil.log({
      type: 'error',
      message: `Buy ${quantity} ${symbol} Failed`,
    })
    return {
      status: 'not ok'
    }
  }
}


export const sellToOpen = async (symbol: string, option_symbol: string, quantity: number) => {
  const url = `accounts/${process.env.ACCOUNTNUM}/orders`

  const body = {
    account_id: process.env.ACCOUNTNUM,
    class: 'option',
    symbol,
    option_symbol,
    side: 'sell_to_open',
    quantity,
    type: 'market',
    duration: 'day',
  }

  try {
    const result = await network.post(url, body, false)
    logUtil.log(`Sell-to-open ${quantity} ${option_symbol}`)
    return result
  } catch (e) {
    logUtil.log({
      type: 'error',
      message: `Sell-to-open ${quantity} ${option_symbol} Failed`,
    })
    return {
      status: 'not ok'
    }
  }
}


export const sellToClose = async (symbol: string, option_symbol: string, quantity: number) => {
  const url = `accounts/${process.env.ACCOUNTNUM}/orders`

  const body = {
    account_id: process.env.ACCOUNTNUM,
    class: 'option',
    symbol,
    option_symbol,
    side: 'sell_to_close',
    quantity,
    type: 'market',
    duration: 'day',
  }

  try {
    const result = await network.post(url, body, false)
    logUtil.log(`Sell-to-close ${quantity} ${option_symbol}`)
    return result
  } catch (e) {
    logUtil.log({
      type: 'error',
      message: `Sell-to-close ${quantity} ${option_symbol} Failed`,
    })
    return {
      status: 'not ok'
    }
  }
}


export const buyToClose = async (symbol: string, option_symbol: string, quantity: number, buyToCloseAmount: number) => {
  const url = `accounts/${process.env.ACCOUNTNUM}/orders`

  const body = {
    account_id: process.env.ACCOUNTNUM,
    class: 'option',
    symbol,
    option_symbol,
    side: 'buy_to_close',
    quantity,
    type: 'limit',
    price: buyToCloseAmount,
    duration: 'gtc',
  }

  try {
    const result = await network.post(url, body, false)
    logUtil.log(`Buy-to-close ${quantity} ${option_symbol}`)
    return result
  } catch (e) {
    logUtil.log({
      type: 'error',
      message: `Buy-to-close ${quantity} ${option_symbol} Failed`,
    })
    return {
      status: 'not ok'
    }
  }
}


export const buyToCloseMarket = async (symbol: string, option_symbol: string, quantity: number) => {
  const url = `accounts/${process.env.ACCOUNTNUM}/orders`

  const body = {
    account_id: process.env.ACCOUNTNUM,
    class: 'option',
    symbol,
    option_symbol,
    side: 'buy_to_close',
    quantity,
    type: 'market',
    duration: 'gtc',
  }

  try {
    const result = await network.post(url, body, false)
    logUtil.log(`Buy-to-close Market Price ${quantity} ${option_symbol}`)
    return result
  } catch (e) {
    logUtil.log({
      type: 'error',
      message: `Buy-to-close Market Price ${quantity} ${option_symbol} Failed`,
    })
    return {
      status: 'not ok'
    }
  }
}


export type MultilegOptionType = 'market' | 'debit' | 'credit' | 'even'
export type OptionOrderSide = 'buy_to_open' | 'buy_to_close' | 'sell_to_open' | 'sell_to_close'
export type MultilegOptionLeg = {
  symbol: string,
  side: OptionOrderSide,
  quantity: number,
}

export const multilegOptionOrder = async (underlying: string, type: MultilegOptionType, legs: MultilegOptionLeg[]) => {
  const url = `accounts/${process.env.ACCOUNTNUM}/orders`

  const mainBody = {
    account_id: process.env.ACCOUNTNUM,
    class: 'multileg',
    symbol: underlying,
    type,
    duration: 'day',
    price: 0.05,
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

  try {
    const result = await network.post(url, bodyWithLegs, false)
    logUtil.log(`Multileg Order ${underlying}`)
    return result
  } catch (e) {
    logUtil.log({
      type: 'error',
      message: `Multileg Order ${underlying} Failed`,
    })
    return {
      status: 'not ok'
    }
  }
}


export const cancelOrders = async (orderIDs: number[]) => {
  for (let x = 0; x < orderIDs.length; x++) {
    const url = `accounts/${process.env.ACCOUNTNUM}/orders/${orderIDs[x]}`
    try {
      await network.deleteReq(url)
    } catch (e) {
      logUtil.log({
        type: 'error',
        message: `Could not cancel ${orderIDs[x]}`,
      })
    }
  }
}

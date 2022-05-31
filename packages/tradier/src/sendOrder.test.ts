import * as network from './network'
import * as logUtil from '@penny/logger'
import {
  buy,
  buyToOpen,
  sellToOpen,
  buyToClose,
  sellToClose,
  buyToCloseMarket,
  multilegOptionOrder,
  cancelOrders,
} from './sendOrder'


const correctUrlAndBodyTest = async (func: Function, funcArgs: Array<any>, expectBody: object) => {
  process.env.ACCOUNTNUM = 'thisisanaccountnumber'
    // @ts-ignore
    network.post.mockReturnValue({ status: 'ok' })
    await func(...funcArgs)
    // @ts-ignore
    expect(network.post.mock.calls[0][0]).toEqual('accounts/thisisanaccountnumber/orders')
    // @ts-ignore
    expect(network.post.mock.calls[0][1]).toEqual(expectBody)
    // @ts-ignore
    expect(network.post.mock.calls[0][2]).toEqual(false)
}

const testForFailure = async (func: Function, funcArgs: Array<any>, failureMessage: string) => {
  // @ts-ignore
  network.post.mockImplementation(() => {
    throw new Error('Ope')
  })
  const result = await func(...funcArgs)
  expect(result).toEqual({ status: 'not ok' })
  expect(logUtil.log).toHaveBeenCalledTimes(2)
  expect(logUtil.log).toHaveBeenCalledWith({ type: 'error', message: failureMessage })
  expect(logUtil.log).toHaveBeenCalledWith({ type: 'error', message: 'Ope' })
}

const testForHappyPathReturn = async (func: Function, funcArgs: Array<any>, successMessage: string) => {
  // @ts-ignore
  network.post.mockReturnValue({ status: 'ok', orderId: 'something' })
  const result = await func(...funcArgs)
  expect(result).toEqual({ status: 'ok', orderId: 'something' })
  expect(logUtil.log).toHaveBeenCalledTimes(1)
  expect(logUtil.log).toHaveBeenCalledWith(successMessage)
}


const randomStock = () => {
  const stonks = [ 'AAPL', 'TSLA', 'SFIX', 'AMC', 'BBY' ]
  return stonks[Math.floor(Math.random() * stonks.length)]
}


const runTests = async (func: Function, funcArgs: Array<any>, successMessage: string, failureMessage: string, expectBody: object) => {
  // @ts-ignore
  network.post = jest.fn()
  // @ts-ignore
  logUtil.log = jest.fn()
  await correctUrlAndBodyTest(func, funcArgs, expectBody)
  jest.resetAllMocks()
  await testForFailure(func, funcArgs, failureMessage)
  jest.resetAllMocks()
  await testForHappyPathReturn(func, funcArgs, successMessage)
}


describe('sendOrder common functions', () => {
  let symbol
  let optionSymbol
  let optionSymbol2
  let quantity
  let limitPrice
  let legs

  beforeEach(() => {
    symbol = randomStock()
    optionSymbol = symbol + '1234P3214'
    optionSymbol2 = symbol + '1234C3214'
    quantity = Math.floor(Math.random() * 100) + 1
    limitPrice = (Math.random() * 100) + 1

    legs = [
      {
        symbol: optionSymbol,
        side: 'sell_to_open',
        quantity: 2,
      },
      {
        symbol: optionSymbol2,
        side: 'buy_to_open',
        quantity: 3,
      },
    ]
  })

  it('buy', async () => {
    await runTests(buy, [ symbol, quantity ], `Buy ${quantity} ${symbol}`, `Buy ${quantity} ${symbol} Failed`, {
      account_id: 'thisisanaccountnumber',
      class: 'equity',
      symbol,
      side: 'buy',
      quantity,
      type: 'market',
      duration: 'day',
    })
  })

  it('buyToOpen', async () => {
    await runTests(buyToOpen, [ symbol, optionSymbol, quantity, limitPrice ], `Buy-to-open ${quantity} ${symbol}`, `Buy-to-open ${quantity} ${symbol} Failed`, {
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol,
      option_symbol: optionSymbol,
      side: 'buy_to_open',
      quantity,
      type: 'limit',
      price: limitPrice,
      duration: 'day',
    })
  })

  it('sellToOpen', async () => {
    await runTests(sellToOpen, [ symbol, optionSymbol, quantity ], `Sell-to-open ${quantity} ${optionSymbol}`, `Sell-to-open ${quantity} ${optionSymbol} Failed`, {
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol,
      option_symbol: optionSymbol,
      side: 'sell_to_open',
      quantity,
      type: 'market',
      duration: 'day',
    })
  })

  it('buyToClose', async () => {
    await runTests(buyToClose, [ symbol, optionSymbol, quantity, 0.18 ], `Buy-to-close ${quantity} ${optionSymbol}`, `Buy-to-close ${quantity} ${optionSymbol} Failed`, {
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol,
      option_symbol: optionSymbol,
      side: 'buy_to_close',
      quantity,
      type: 'limit',
      price: 0.18,
      duration: 'gtc',
    })
  })

  it('sellToClose', async () => {
    await runTests(sellToClose, [ symbol, optionSymbol, quantity ], `Sell-to-close ${quantity} ${optionSymbol}`, `Sell-to-close ${quantity} ${optionSymbol} Failed`, {
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol,
      option_symbol: optionSymbol,
      side: 'sell_to_close',
      quantity,
      type: 'market',
      duration: 'gtc',
    })
  })

  it('buyToCloseMarket', async () => {
    await runTests(buyToCloseMarket, [ symbol, optionSymbol, quantity ], `Buy-to-close Market Price ${quantity} ${optionSymbol}`, `Buy-to-close Market Price ${quantity} ${optionSymbol} Failed`, {
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol,
      option_symbol: optionSymbol,
      side: 'buy_to_close',
      quantity,
      type: 'market',
      duration: 'gtc',
    })
  })

  it('multilegOptionOrder', async () => {
    await runTests(multilegOptionOrder, [ symbol, 'debit', legs, 0.12 ], `Multileg Order ${symbol}`, `Multileg Order ${symbol} Failed`, {
      account_id: 'thisisanaccountnumber',
      class: 'multileg',
      symbol,
      'option_symbol[0]': optionSymbol,
      'option_symbol[1]': optionSymbol2,
      'quantity[0]': 2,
      'quantity[1]': 3,
      'side[0]': 'sell_to_open',
      'side[1]': 'buy_to_open',
      price: 0.12,
      type: 'debit',
      duration: 'day',
    })
  })

  it('multilegOptionOrder with default price', async () => {
    await runTests(multilegOptionOrder, [ symbol, 'debit', legs ], `Multileg Order ${symbol}`, `Multileg Order ${symbol} Failed`, {
      account_id: 'thisisanaccountnumber',
      class: 'multileg',
      symbol,
      'option_symbol[0]': optionSymbol,
      'option_symbol[1]': optionSymbol2,
      'quantity[0]': 2,
      'quantity[1]': 3,
      'side[0]': 'sell_to_open',
      'side[1]': 'buy_to_open',
      price: 0.07,
      type: 'debit',
      duration: 'day',
    })
  })
})


describe('cancelOrders', () => {
  beforeEach(() => {
    // @ts-ignore
    network.deleteReq = jest.fn()
    // @ts-ignore
    logUtil.log = jest.fn()
  })

  it('Send a cancel order for each orderID', async () => {
    process.env.ACCOUNTNUM = 'thisisanaccountnumber'
    await cancelOrders([1234, 4321, 147])
    expect(network.deleteReq).toHaveBeenCalledTimes(3)
    expect(network.deleteReq).toHaveBeenCalledWith('accounts/thisisanaccountnumber/orders/1234')
    expect(network.deleteReq).toHaveBeenCalledWith('accounts/thisisanaccountnumber/orders/4321')
    expect(network.deleteReq).toHaveBeenCalledWith('accounts/thisisanaccountnumber/orders/147')
  })

  it('If an order fails, logs the failure and continues', async () => {
    process.env.ACCOUNTNUM = 'thisisanaccountnumber'
    // @ts-ignore
    network.deleteReq.mockImplementation((url) => {
      if (url === 'accounts/thisisanaccountnumber/orders/4321') {
        const error = new Error('OH NO!!!')
        throw error
      }
    })
    await cancelOrders([1234, 4321, 147])
    expect(network.deleteReq).toHaveBeenCalledTimes(3)
    expect(network.deleteReq).toHaveBeenCalledWith('accounts/thisisanaccountnumber/orders/1234')
    expect(network.deleteReq).toHaveBeenCalledWith('accounts/thisisanaccountnumber/orders/4321')
    expect(network.deleteReq).toHaveBeenCalledWith('accounts/thisisanaccountnumber/orders/147')
    expect(logUtil.log).toHaveBeenCalledTimes(1)
    expect(logUtil.log).toHaveBeenCalledWith({
      type: 'error',
      message: 'Could not cancel 4321',
    })
  })
})
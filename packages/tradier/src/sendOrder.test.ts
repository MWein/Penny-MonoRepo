import * as network from './network'
import * as logUtil from '@penny/logger'
import {
  buy,
  sellToOpen,
  buyToClose,
  sellToClose,
  buyToCloseMarket,
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
  expect(logUtil.log).toHaveBeenCalledTimes(1)
  expect(logUtil.log).toHaveBeenCalledWith({ type: 'error', message: failureMessage })
}

const testForHappyPathReturn = async (func: Function, funcArgs: Array<any>, successMessage: string) => {
  // @ts-ignore
  network.post.mockReturnValue({ status: 'ok', orderId: 'something' })
  const result = await func(...funcArgs)
  expect(result).toEqual({ status: 'ok', orderId: 'something' })
  expect(logUtil.log).toHaveBeenCalledTimes(1)
  expect(logUtil.log).toHaveBeenCalledWith(successMessage)
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
  it('buy', async () => {
    const quantity = Math.floor(Math.random() * 100) + 1
    await runTests(buy, [ 'AAPL', quantity ], `Buy ${quantity} AAPL`, `Buy ${quantity} AAPL Failed`, {
      account_id: 'thisisanaccountnumber',
      class: 'equity',
      symbol: 'AAPL',
      side: 'buy',
      quantity,
      type: 'market',
      duration: 'day',
    })
  })

  it('sellToOpen', async () => {
    const quantity = Math.floor(Math.random() * 100) + 1
    await runTests(sellToOpen, [ 'AAPL', 'AAAAAAPL', quantity ], `Sell-to-open ${quantity} AAAAAAPL`, `Sell-to-open ${quantity} AAAAAAPL Failed`, {
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol: 'AAPL',
      option_symbol: 'AAAAAAPL',
      side: 'sell_to_open',
      quantity,
      type: 'market',
      duration: 'day',
    })
  })

  it('buyToClose', async () => {
    const quantity = Math.floor(Math.random() * 100) + 1
    await runTests(buyToClose, [ 'AAPL', 'AAAAAAPL', quantity, 0.18 ], `Buy-to-close ${quantity} AAAAAAPL`, `Buy-to-close ${quantity} AAAAAAPL Failed`, {
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol: 'AAPL',
      option_symbol: 'AAAAAAPL',
      side: 'buy_to_close',
      quantity,
      type: 'limit',
      price: 0.18,
      duration: 'gtc',
    })
  })

  it('sellToClose', async () => {
    const quantity = Math.floor(Math.random() * 100) + 1
    await runTests(sellToClose, [ 'AAPL', 'AAAAAAPL', quantity ], `Sell-to-close ${quantity} AAAAAAPL`, `Sell-to-close ${quantity} AAAAAAPL Failed`, {
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol: 'AAPL',
      option_symbol: 'AAAAAAPL',
      side: 'sell_to_close',
      quantity,
      type: 'market',
      duration: 'gtc',
    })
  })

  it('buyToCloseMarket', async () => {
    const quantity = Math.floor(Math.random() * 100) + 1
    await runTests(buyToCloseMarket, [ 'AAPL', 'AAAAAAPL', quantity ], `Buy-to-close Market Price ${quantity} AAAAAAPL`, `Buy-to-close Market Price ${quantity} AAAAAAPL Failed`, {
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol: 'AAPL',
      option_symbol: 'AAAAAAPL',
      side: 'buy_to_close',
      quantity,
      type: 'market',
      duration: 'gtc',
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
    network.deleteReq.mockImplementationOnce(() => {})
    // @ts-ignore
    network.deleteReq.mockImplementationOnce(() => {
      const error = new Error('OH NO!!!')
      throw error
    })
    // @ts-ignore
    network.deleteReq.mockImplementationOnce(() => {})
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
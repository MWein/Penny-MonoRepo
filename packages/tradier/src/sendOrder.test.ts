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


const correctUrlAndBodyTest = async (func: Function, funcArgs: Array<any>, expectBody) => {
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


describe('buy', () => {
  beforeEach(() => {
    // @ts-ignore
    network.post = jest.fn()
    // @ts-ignore
    logUtil.log = jest.fn()
  })

  it('Calls with the correct url and body; skips throttle', async () => {
    await correctUrlAndBodyTest(buy, [ 'AAPL', 2 ], {
      account_id: 'thisisanaccountnumber',
      class: 'equity',
      symbol: 'AAPL',
      side: 'buy',
      quantity: 2,
      type: 'market',
      duration: 'day',
    })
  })

  it('Returns failed status object if network call throws', async () => {
    await testForFailure(buy, [ 'AAPL', 1 ], 'Buy 1 AAPL Failed')
  })

  it('On success, returns whatever the endpoint returned', async () => {
    await testForHappyPathReturn(buy, [ 'AAPL', 1 ], 'Buy 1 AAPL')
  })
})


describe('sellToOpen', () => {
  beforeEach(() => {
    // @ts-ignore
    network.post = jest.fn()
    // @ts-ignore
    logUtil.log = jest.fn()
  })

  it('Calls with the correct url and body; skips throttle', async () => {
    await correctUrlAndBodyTest(sellToOpen, [ 'AAPL', 'AAAAAAPL', 2 ], {
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol: 'AAPL',
      option_symbol: 'AAAAAAPL',
      side: 'sell_to_open',
      quantity: 2,
      type: 'market',
      duration: 'day',
    })
  })

  it('Returns failed status object if network call throws', async () => {
    await testForFailure(sellToOpen, [ 'AAPL', 'AAAAAPL', 1 ], 'Sell-to-open 1 AAAAAPL Failed')
  })

  it('On success, returns whatever the endpoint returned', async () => {
    await testForHappyPathReturn(sellToOpen, [ 'AAPL', 'AAAAAPL', 1 ], 'Sell-to-open 1 AAAAAPL')
  })
})


describe('buyToClose', () => {
  beforeEach(() => {
    // @ts-ignore
    network.post = jest.fn()
    // @ts-ignore
    logUtil.log = jest.fn()
  })

  it('Calls with the correct url and body; skips throttle', async () => {
    await correctUrlAndBodyTest(buyToClose, [ 'AAPL', 'AAAAAAPL', 2, 0.18 ], {
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol: 'AAPL',
      option_symbol: 'AAAAAAPL',
      side: 'buy_to_close',
      quantity: 2,
      type: 'limit',
      price: 0.18,
      duration: 'gtc',
    })
  })

  it('Returns failed status object if network call throws', async () => {
    await testForFailure(buyToClose, [ 'AAPL', 'AAAAAPL', 1, 0.11 ], 'Buy-to-close 1 AAAAAPL Failed')
  })

  it('On success, returns whatever the endpoint returned', async () => {
    await testForHappyPathReturn(buyToClose, [ 'AAPL', 'AAAAAPL', 1, 0.10 ], 'Buy-to-close 1 AAAAAPL')
  })
})


describe('sellToClose', () => {
  beforeEach(() => {
    // @ts-ignore
    network.post = jest.fn()
    // @ts-ignore
    logUtil.log = jest.fn()
  })

  it('Calls with the correct url and body; skips throttle', async () => {
    await correctUrlAndBodyTest(sellToClose, [ 'AAPL', 'AAAAAAPL', 2 ], {
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol: 'AAPL',
      option_symbol: 'AAAAAAPL',
      side: 'sell_to_close',
      quantity: 2,
      type: 'market',
      duration: 'gtc',
    })
  })

  it('Returns failed status object if network call throws', async () => {
    await testForFailure(sellToClose, [ 'AAPL', 'AAAAAPL', 1 ], 'Sell-to-close 1 AAAAAPL Failed')
  })

  it('On success, returns whatever the endpoint returned', async () => {
    await testForHappyPathReturn(sellToClose, [ 'AAPL', 'AAAAAPL', 1 ], 'Sell-to-close 1 AAAAAPL')
  })
})


describe('buyToCloseMarket', () => {
  beforeEach(() => {
    // @ts-ignore
    network.post = jest.fn()
    // @ts-ignore
    logUtil.log = jest.fn()
  })

  it('Calls with the correct url and body; skips throttle', async () => {
    await correctUrlAndBodyTest(buyToCloseMarket, [ 'AAPL', 'AAAAAAPL', 2 ], {
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol: 'AAPL',
      option_symbol: 'AAAAAAPL',
      side: 'buy_to_close',
      quantity: 2,
      type: 'market',
      duration: 'gtc',
    })
  })

  it('Returns failed status object if network call throws', async () => {
    await testForFailure(buyToCloseMarket, [ 'AAPL', 'AAAAAPL', 1 ], 'Buy-to-close Market Price 1 AAAAAPL Failed')
  })

  it('On success, returns whatever the endpoint returned', async () => {
    await testForHappyPathReturn(buyToCloseMarket, [ 'AAPL', 'AAAAAPL', 1 ], 'Buy-to-close Market Price 1 AAAAAPL')
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
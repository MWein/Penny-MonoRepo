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


describe('buy', () => {
  beforeEach(() => {
    // @ts-ignore
    network.post = jest.fn()
    // @ts-ignore
    logUtil.log = jest.fn()
  })

  it('Calls with the correct url and body; skips throttle', async () => {
    process.env.ACCOUNTNUM = 'thisisanaccountnumber'
    // @ts-ignore
    network.post.mockReturnValue({ status: 'ok' })
    await buy('AAPL', 2)
    // @ts-ignore
    expect(network.post.mock.calls[0][0]).toEqual('accounts/thisisanaccountnumber/orders')
    // @ts-ignore
    expect(network.post.mock.calls[0][1]).toEqual({
      account_id: 'thisisanaccountnumber',
      class: 'equity',
      symbol: 'AAPL',
      side: 'buy',
      quantity: 2,
      type: 'market',
      duration: 'day',
    })
    // @ts-ignore
    expect(network.post.mock.calls[0][2]).toEqual(false)
  })

  it('Returns failed status object if network call throws', async () => {
    // @ts-ignore
    network.post.mockImplementation(() => {
      throw new Error('Ope')
    })
    const result = await buy('AAPL', 1)
    expect(result).toEqual({ status: 'not ok' })
    expect(logUtil.log).toHaveBeenCalledTimes(1)
    expect(logUtil.log).toHaveBeenCalledWith({ type: 'error', message: 'Buy 1 AAPL Failed' })
  })

  it('On success, returns whatever the endpoint returned', async () => {
    // @ts-ignore
    network.post.mockReturnValue({ status: 'ok', orderId: 'something' })
    const result = await buy('AAPL', 1)
    expect(result).toEqual({ status: 'ok', orderId: 'something' })
    expect(logUtil.log).toHaveBeenCalledTimes(1)
    expect(logUtil.log).toHaveBeenCalledWith('Buy 1 AAPL')
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
    process.env.ACCOUNTNUM = 'thisisanaccountnumber'
    // @ts-ignore
    network.post.mockReturnValue({ status: 'ok' })
    await sellToOpen('AAPL', 'AAAAAAPL', 2)
    // @ts-ignore
    expect(network.post.mock.calls[0][0]).toEqual('accounts/thisisanaccountnumber/orders')
    // @ts-ignore
    expect(network.post.mock.calls[0][1]).toEqual({
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol: 'AAPL',
      option_symbol: 'AAAAAAPL',
      side: 'sell_to_open',
      quantity: 2,
      type: 'market',
      duration: 'day',
    })
    // @ts-ignore
    expect(network.post.mock.calls[0][2]).toEqual(false)
  })

  it('Returns failed status object if network call throws', async () => {
    // @ts-ignore
    network.post.mockImplementation(() => {
      throw new Error('Ope')
    })
    const result = await sellToOpen('AAPL', 'AAAAAPL', 1)
    expect(result).toEqual({ status: 'not ok' })
    expect(logUtil.log).toHaveBeenCalledTimes(1)
    expect(logUtil.log).toHaveBeenCalledWith({ type: 'error', message: 'Sell-to-open 1 AAAAAPL Failed' })
  })

  it('On success, returns whatever the endpoint returned', async () => {
    // @ts-ignore
    network.post.mockReturnValue({ status: 'ok', orderId: 'something' })
    const result = await sellToOpen('AAPL', 'AAAAAPL', 1)
    expect(result).toEqual({ status: 'ok', orderId: 'something' })
    expect(logUtil.log).toHaveBeenCalledTimes(1)
    expect(logUtil.log).toHaveBeenCalledWith('Sell-to-open 1 AAAAAPL')
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
    process.env.ACCOUNTNUM = 'thisisanaccountnumber'
    // @ts-ignore
    network.post.mockReturnValue({ status: 'ok' })
    await buyToClose('AAPL', 'AAAAAAPL', 2, 0.18)
    // @ts-ignore
    expect(network.post.mock.calls[0][0]).toEqual('accounts/thisisanaccountnumber/orders')
    // @ts-ignore
    expect(network.post.mock.calls[0][1]).toEqual({
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
    // @ts-ignore
    expect(network.post.mock.calls[0][2]).toEqual(false)
  })

  it('Returns failed status object if network call throws', async () => {
    // @ts-ignore
    network.post.mockImplementation(() => {
      throw new Error('Ope')
    })
    const result = await buyToClose('AAPL', 'AAAAAPL', 1, 0.11)
    expect(result).toEqual({ status: 'not ok' })
    expect(logUtil.log).toHaveBeenCalledTimes(1)
    expect(logUtil.log).toHaveBeenCalledWith({ type: 'error', message: 'Buy-to-close 1 AAAAAPL Failed' })
  })

  it('On success, returns whatever the endpoint returned', async () => {
    // @ts-ignore
    network.post.mockReturnValue({ status: 'ok', orderId: 'something' })
    const result = await buyToClose('AAPL', 'AAAAAPL', 1, 0.10)
    expect(result).toEqual({ status: 'ok', orderId: 'something' })
    expect(logUtil.log).toHaveBeenCalledTimes(1)
    expect(logUtil.log).toHaveBeenCalledWith('Buy-to-close 1 AAAAAPL')
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
    process.env.ACCOUNTNUM = 'thisisanaccountnumber'
    // @ts-ignore
    network.post.mockReturnValue({ status: 'ok' })
    await sellToClose('AAPL', 'AAAAAAPL', 2)
    // @ts-ignore
    expect(network.post.mock.calls[0][0]).toEqual('accounts/thisisanaccountnumber/orders')
    // @ts-ignore
    expect(network.post.mock.calls[0][1]).toEqual({
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol: 'AAPL',
      option_symbol: 'AAAAAAPL',
      side: 'sell_to_close',
      quantity: 2,
      type: 'market',
      duration: 'gtc',
    })
    // @ts-ignore
    expect(network.post.mock.calls[0][2]).toEqual(false)
  })

  it('Returns failed status object if network call throws', async () => {
    // @ts-ignore
    network.post.mockImplementation(() => {
      throw new Error('Ope')
    })
    const result = await sellToClose('AAPL', 'AAAAAPL', 1)
    expect(result).toEqual({ status: 'not ok' })
    expect(logUtil.log).toHaveBeenCalledTimes(1)
    expect(logUtil.log).toHaveBeenCalledWith({ type: 'error', message: 'Sell-to-close 1 AAAAAPL Failed' })
  })

  it('On success, returns whatever the endpoint returned', async () => {
    // @ts-ignore
    network.post.mockReturnValue({ status: 'ok', orderId: 'something' })
    const result = await sellToClose('AAPL', 'AAAAAPL', 1)
    expect(result).toEqual({ status: 'ok', orderId: 'something' })
    expect(logUtil.log).toHaveBeenCalledTimes(1)
    expect(logUtil.log).toHaveBeenCalledWith('Sell-to-close 1 AAAAAPL')
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
    process.env.ACCOUNTNUM = 'thisisanaccountnumber'
    // @ts-ignore
    network.post.mockReturnValue({ status: 'ok' })
    await buyToCloseMarket('AAPL', 'AAAAAAPL', 2)
    // @ts-ignore
    expect(network.post.mock.calls[0][0]).toEqual('accounts/thisisanaccountnumber/orders')
    // @ts-ignore
    expect(network.post.mock.calls[0][1]).toEqual({
      account_id: 'thisisanaccountnumber',
      class: 'option',
      symbol: 'AAPL',
      option_symbol: 'AAAAAAPL',
      side: 'buy_to_close',
      quantity: 2,
      type: 'market',
      duration: 'gtc',
    })
    // @ts-ignore
    expect(network.post.mock.calls[0][2]).toEqual(false)
  })

  it('Returns failed status object if network call throws', async () => {
    // @ts-ignore
    network.post.mockImplementation(() => {
      throw new Error('Ope')
    })
    const result = await buyToCloseMarket('AAPL', 'AAAAAPL', 1)
    expect(result).toEqual({ status: 'not ok' })
    expect(logUtil.log).toHaveBeenCalledTimes(1)
    expect(logUtil.log).toHaveBeenCalledWith({ type: 'error', message: 'Buy-to-close Market Price 1 AAAAAPL Failed' })
  })

  it('On success, returns whatever the endpoint returned', async () => {
    // @ts-ignore
    network.post.mockReturnValue({ status: 'ok', orderId: 'something' })
    const result = await buyToCloseMarket('AAPL', 'AAAAAPL', 1)
    expect(result).toEqual({ status: 'ok', orderId: 'something' })
    expect(logUtil.log).toHaveBeenCalledTimes(1)
    expect(logUtil.log).toHaveBeenCalledWith('Buy-to-close Market Price 1 AAAAAPL')
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
import * as getOrdersUtil from './getOrders'
import * as sendOrderUtil from './sendOrder'
import * as sleepUtil from '@penny/sleep'
import { closePositions } from './closePositions'
import { generatePositionObject } from '@penny/test-helpers'

describe('closePositions', () => {
  beforeEach(() => {
    // @ts-ignore
    getOrdersUtil.getOrders = jest.fn()
    // @ts-ignore
    sendOrderUtil.multilegOptionOrder = jest.fn()
    // @ts-ignore
    sendOrderUtil.cancelOrders = jest.fn()
    // @ts-ignore
    sleepUtil.sleep = jest.fn()
  })


  it('Does nothing if given empty position array', async () => {
    await closePositions([])
    expect(getOrdersUtil.getOrders).not.toHaveBeenCalled()
    expect(sendOrderUtil.cancelOrders).not.toHaveBeenCalled()
    expect(sleepUtil.sleep).not.toHaveBeenCalled()
    expect(sendOrderUtil.multilegOptionOrder).not.toHaveBeenCalled()
  })


  it('Creates close orders if there arent any existing orders', async () => {
    // @ts-ignore
    getOrdersUtil.getOrders.mockReturnValue([])

    await closePositions([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-10-12', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-10-12', 1234, '2021-01-01', 172.5),
    ])

    expect(getOrdersUtil.getOrders).toHaveBeenCalled()
    expect(sendOrderUtil.cancelOrders).not.toHaveBeenCalled()
    expect(sleepUtil.sleep).not.toHaveBeenCalled()
    expect(sendOrderUtil.multilegOptionOrder).toHaveBeenCalledTimes(1)
    expect(sendOrderUtil.multilegOptionOrder).toHaveBeenCalledWith('AAPL', 'market', [
      {
        symbol: 'AAPL210101C00175000',
        side: 'sell_to_close',
        quantity: 1
      },
      {
        symbol: 'AAPL210101C00172500',
        side: 'buy_to_close',
        quantity: 1
      },
    ])
  })


  it('Creates close orders for each symbol if there arent any existing orders', async () => {
    // @ts-ignore
    getOrdersUtil.getOrders.mockReturnValue([])

    await closePositions([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-10-12', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-10-12', 1234, '2021-01-01', 172.5),
      generatePositionObject('TSLA', 1, 'call', 8, '2021-10-12', 1234, '2021-01-01', 175),
      generatePositionObject('TSLA', -1, 'call', -20, '2021-10-12', 1234, '2021-01-01', 172.5),
    ])

    expect(getOrdersUtil.getOrders).toHaveBeenCalled()
    expect(sendOrderUtil.cancelOrders).not.toHaveBeenCalled()
    expect(sleepUtil.sleep).not.toHaveBeenCalled()
    expect(sendOrderUtil.multilegOptionOrder).toHaveBeenCalledTimes(2)
    expect(sendOrderUtil.multilegOptionOrder).toHaveBeenCalledWith('AAPL', 'market', [
      {
        symbol: 'AAPL210101C00175000',
        side: 'sell_to_close',
        quantity: 1
      },
      {
        symbol: 'AAPL210101C00172500',
        side: 'buy_to_close',
        quantity: 1
      },
    ])
    expect(sendOrderUtil.multilegOptionOrder).toHaveBeenCalledWith('TSLA', 'market', [
      {
        symbol: 'TSLA210101C00175000',
        side: 'sell_to_close',
        quantity: 1
      },
      {
        symbol: 'TSLA210101C00172500',
        side: 'buy_to_close',
        quantity: 1
      },
    ])
  })


  it('Closes any existing orders that contain doomed symbols, ignores orders without doomed symbols', async () => {
    // @ts-ignore
    getOrdersUtil.getOrders.mockReturnValue([
      {
        id: 1234,
        class: 'multileg',
        status: 'open',
        symbol: 'AAPL',
        type: 'debit',
        duration: 'day',
        price: 7,
        'option_symbol[0]': 'AAPL210101C00175000',
        'option_symbol[1]': 'AAPL210101C00172500',
      },
      {
        id: 4321,
        class: 'multileg',
        status: 'open',
        symbol: 'AAPL',
        type: 'debit',
        duration: 'day',
        price: 7,
        'option_symbol[0]': 'TSLA210101C00175000',
        'option_symbol[1]': 'TSLA210101C00172500',
      },
      {
        id: 5550123,
        class: 'multileg',
        status: 'open',
        symbol: 'AAPL',
        type: 'debit',
        duration: 'day',
        price: 7,
        'option_symbol[0]': 'BAC210101C00175000',
        'option_symbol[1]': 'BAC210101C00172500',
      }
    ])

    await closePositions([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-10-12', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-10-12', 1234, '2021-01-01', 172.5),
      generatePositionObject('TSLA', 1, 'call', 8, '2021-10-12', 1234, '2021-01-01', 175),
      generatePositionObject('TSLA', -1, 'call', -20, '2021-10-12', 1234, '2021-01-01', 172.5),
    ])

    expect(getOrdersUtil.getOrders).toHaveBeenCalled()
    expect(sendOrderUtil.cancelOrders).toHaveBeenCalledWith([ 1234, 4321 ])
    expect(sleepUtil.sleep).toHaveBeenCalledWith(10)
    expect(sendOrderUtil.multilegOptionOrder).toHaveBeenCalledTimes(2)
    expect(sendOrderUtil.multilegOptionOrder).toHaveBeenCalledWith('AAPL', 'market', [
      {
        symbol: 'AAPL210101C00175000',
        side: 'sell_to_close',
        quantity: 1
      },
      {
        symbol: 'AAPL210101C00172500',
        side: 'buy_to_close',
        quantity: 1
      },
    ])
    expect(sendOrderUtil.multilegOptionOrder).toHaveBeenCalledWith('TSLA', 'market', [
      {
        symbol: 'TSLA210101C00175000',
        side: 'sell_to_close',
        quantity: 1
      },
      {
        symbol: 'TSLA210101C00172500',
        side: 'buy_to_close',
        quantity: 1
      },
    ])
  })
})
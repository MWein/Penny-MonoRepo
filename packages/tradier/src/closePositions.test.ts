import * as getOrdersUtil from './getOrders'
import * as sendOrderUtil from './sendOrder'
import * as sleepUtil from '@penny/sleep'
import {
  closePositions,
  closePositionsIndividual,
} from './closePositions'
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


describe('closePositionsIndividual', () => {
  beforeEach(() => {
    // @ts-ignore
    sendOrderUtil.sellToClose = jest.fn()
    // @ts-ignore
    sendOrderUtil.buyToCloseMarket = jest.fn()
    // @ts-ignore
    sleepUtil.sleep = jest.fn()
  })

  it('Does nothing if there arent any positions given', async () => {
    await closePositionsIndividual([])
    expect(sendOrderUtil.sellToClose).not.toHaveBeenCalled()
    expect(sendOrderUtil.buyToCloseMarket).not.toHaveBeenCalled()
    expect(sleepUtil.sleep).not.toHaveBeenCalled()
  })

  it('Does nothing if there are only stock positions', async () => {
    await closePositionsIndividual([
      generatePositionObject('AAPL', 34, 'stock', 200),
      generatePositionObject('MSFT', 34, 'stock', 200),
    ])
    expect(sendOrderUtil.sellToClose).not.toHaveBeenCalled()
    expect(sendOrderUtil.buyToCloseMarket).not.toHaveBeenCalled()
    expect(sleepUtil.sleep).not.toHaveBeenCalled()
  })

  it('Sells to close long positions', async () => {
    const positions = [
      generatePositionObject('AAPL', 2, 'call', 200, '2022-05-29', 1234, '2022-05-30', 180),
      generatePositionObject('MSFT', 1, 'put', 200, '2022-05-29', 1234, '2022-05-30', 70),
    ]
    await closePositionsIndividual(positions)
    expect(sendOrderUtil.sellToClose).toHaveBeenCalledTimes(2)
    expect(sendOrderUtil.sellToClose).toHaveBeenCalledWith('AAPL', positions[0].symbol, 2)
    expect(sendOrderUtil.sellToClose).toHaveBeenCalledWith('MSFT', positions[1].symbol, 1)
  })

  it('Buys to close short positions', async () => {
    const positions = [
      generatePositionObject('AAPL', -2, 'call', 200, '2022-05-29', 1234, '2022-05-30', 180),
      generatePositionObject('MSFT', -1, 'put', 200, '2022-05-29', 1234, '2022-05-30', 70),
    ]
    await closePositionsIndividual(positions)
    expect(sendOrderUtil.buyToCloseMarket).toHaveBeenCalledTimes(2)
    expect(sendOrderUtil.buyToCloseMarket).toHaveBeenCalledWith('AAPL', positions[0].symbol, 2)
    expect(sendOrderUtil.buyToCloseMarket).toHaveBeenCalledWith('MSFT', positions[1].symbol, 1)
  })
})
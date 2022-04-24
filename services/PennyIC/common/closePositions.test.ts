import * as tradier from '@penny/tradier'
import { closePositions } from './closePositions'
import { generatePositionObject } from '@penny/test-helpers'
jest.mock('@penny/tradier')


describe('closePositions', () => {
  beforeEach(() => {
    // @ts-ignore
    tradier.getOrders = jest.fn()
    // @ts-ignore
    tradier.multilegOptionOrder = jest.fn()
    // @ts-ignore
    tradier.cancelOrders = jest.fn()
  })


  it('Does nothing if given empty position array', async () => {
    await closePositions([])
    expect(tradier.getOrders).not.toHaveBeenCalled()
    expect(tradier.cancelOrders).not.toHaveBeenCalled()
    expect(tradier.multilegOptionOrder).not.toHaveBeenCalled()
  })


  it('Creates close orders if there arent any existing orders', async () => {
    // @ts-ignore
    tradier.getOrders.mockReturnValue([])

    await closePositions([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-10-12', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-10-12', 1234, '2021-01-01', 172.5),
    ])

    expect(tradier.getOrders).toHaveBeenCalled()
    expect(tradier.cancelOrders).not.toHaveBeenCalled()
    expect(tradier.multilegOptionOrder).toHaveBeenCalledTimes(1)
    expect(tradier.multilegOptionOrder).toHaveBeenCalledWith('AAPL', 'market', [
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
    tradier.getOrders.mockReturnValue([])

    await closePositions([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-10-12', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-10-12', 1234, '2021-01-01', 172.5),
      generatePositionObject('TSLA', 1, 'call', 8, '2021-10-12', 1234, '2021-01-01', 175),
      generatePositionObject('TSLA', -1, 'call', -20, '2021-10-12', 1234, '2021-01-01', 172.5),
    ])

    expect(tradier.getOrders).toHaveBeenCalled()
    expect(tradier.cancelOrders).not.toHaveBeenCalled()
    expect(tradier.multilegOptionOrder).toHaveBeenCalledTimes(2)
    expect(tradier.multilegOptionOrder).toHaveBeenCalledWith('AAPL', 'market', [
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
    expect(tradier.multilegOptionOrder).toHaveBeenCalledWith('TSLA', 'market', [
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
    tradier.getOrders.mockReturnValue([
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

    expect(tradier.getOrders).toHaveBeenCalled()
    expect(tradier.cancelOrders).toHaveBeenCalledWith([ 1234, 4321 ])
    expect(tradier.multilegOptionOrder).toHaveBeenCalledTimes(2)
    expect(tradier.multilegOptionOrder).toHaveBeenCalledWith('AAPL', 'market', [
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
    expect(tradier.multilegOptionOrder).toHaveBeenCalledWith('TSLA', 'market', [
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
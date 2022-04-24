import * as tradier from '@penny/tradier'
import { createGTCShortOrders } from './createGTCShortOrders'
import { generateOrderObject, generatePositionObject } from '@penny/test-helpers'
jest.mock('@penny/tradier')


describe('createGTCShortOrders', () => {
  beforeEach(() => {
    // @ts-ignore
    tradier.multilegOptionOrder = jest.fn()
    // @ts-ignore
    tradier.getPositions = jest.fn()
    // @ts-ignore
    tradier.getOrders = jest.fn()
  })


  it('Does nothing if there are no positions', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([])
    await createGTCShortOrders()
    expect(tradier.getOrders).not.toHaveBeenCalled()
    expect(tradier.multilegOptionOrder).not.toHaveBeenCalled()
  })


  it('Ignores long positions', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 52, '2021-01-01', 1234, '2021-01-01', 170),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-01', 172.5),
    ])
    await createGTCShortOrders()
    expect(tradier.getPositions).toHaveBeenCalled()
    expect(tradier.getOrders).not.toHaveBeenCalled()
    expect(tradier.multilegOptionOrder).not.toHaveBeenCalled()
  })


  it('Ignores short positions opened same day', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-10-12').getTime())
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-10-12', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-10-12', 1234, '2021-01-01', 172.5),
    ])
    await createGTCShortOrders()
    expect(tradier.getPositions).toHaveBeenCalled()
    expect(tradier.getOrders).not.toHaveBeenCalled()
    expect(tradier.multilegOptionOrder).not.toHaveBeenCalled()
    jest.useRealTimers()
  })


  it('Creates GTC orders for short positions with no orders', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-10-12', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-10-12', 1234, '2021-01-01', 172.5),
    ])
    // @ts-ignore
    tradier.getOrders.mockReturnValue([])
    await createGTCShortOrders()
    expect(tradier.getPositions).toHaveBeenCalled()
    expect(tradier.getOrders).toHaveBeenCalled()
    expect(tradier.multilegOptionOrder).toHaveBeenCalledTimes(1)
    expect(tradier.multilegOptionOrder).toHaveBeenCalledWith('AAPL', 'debit', [
      {
        symbol: 'AAPL210101C00175000',
        quantity: 1,
        side: 'sell_to_close',
      },
      {
        symbol: 'AAPL210101C00172500',
        quantity: 1,
        side: 'buy_to_close',
      },
    ], 6)
  })


  it('Doesnt create GTC orders if an order already exists', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-10-12', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-10-12', 1234, '2021-01-01', 172.5),
    ])

    const order = {
      class: 'multileg',
      status: 'open',
      symbol: 'AAPL',
      type: 'debit',
      duration: 'day',
      price: 7,
      'option_symbol[0]': 'AAPL210101C00175000',
      'option_symbol[1]': 'AAPL210101C00172500',
    }

    // @ts-ignore
    tradier.getOrders.mockReturnValue([
      order
    ])
    await createGTCShortOrders()
    expect(tradier.getPositions).toHaveBeenCalled()
    expect(tradier.getOrders).toHaveBeenCalled()
    expect(tradier.multilegOptionOrder).not.toHaveBeenCalled()
  })
})
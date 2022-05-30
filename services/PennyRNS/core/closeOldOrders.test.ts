import { closeOldOrders } from './closeOldOrders'
import * as tradier from '@penny/tradier'
import { generateOrderObject } from '@penny/test-helpers'
jest.mock('@penny/tradier')

describe('closeOldOrders', () => {
  beforeEach(() => {
    // @ts-ignore
    tradier.getOrders = jest.fn()
    // @ts-ignore
    tradier.cancelOrders = jest.fn()
  })

  it('Does nothing if there are no orders', async () => {
    // @ts-ignore
    tradier.getOrders.mockReturnValue([])
    await closeOldOrders()
    expect(tradier.getOrders).toHaveBeenCalled()
    expect(tradier.cancelOrders).not.toHaveBeenCalled()
  })

  it('Ignores stock orders', async () => {
    // @ts-ignore
    tradier.getOrders.mockReturnValue([
      generateOrderObject('AAPL', 20, 'stock', 'buy', 'open', 1234),
      generateOrderObject('MSFT', 20, 'stock', 'buy', 'open', 1234),
    ])
    await closeOldOrders()
    expect(tradier.getOrders).toHaveBeenCalled()
    expect(tradier.cancelOrders).not.toHaveBeenCalled()
  })

  it('Ignores non buy_to_open orders', async () => {
    // @ts-ignore
    tradier.getOrders.mockReturnValue([
      generateOrderObject('AAPL', 20, 'call', 'sell_to_open', 'open', 1234),
      generateOrderObject('MSFT', 20, 'put', 'buy_to_close', 'open', 1234),
      generateOrderObject('MSFT', 20, 'put', 'sell_to_close', 'open', 1234),
    ])
    await closeOldOrders()
    expect(tradier.getOrders).toHaveBeenCalled()
    expect(tradier.cancelOrders).not.toHaveBeenCalled()
  })

  it('Ignores non-open orders', async () => {
    // @ts-ignore
    tradier.getOrders.mockReturnValue([
      generateOrderObject('AAPL', 20, 'call', 'buy_to_open', 'pending', 1234),
      generateOrderObject('MSFT', 20, 'put', 'buy_to_open', 'filled', 1234),
      generateOrderObject('MSFT', 20, 'put', 'buy_to_open', 'partially_filled', 1234),
      generateOrderObject('MSFT', 20, 'put', 'buy_to_open', 'expired', 1234),
      generateOrderObject('MSFT', 20, 'put', 'buy_to_open', 'cancelled', 1234),
      generateOrderObject('MSFT', 20, 'put', 'buy_to_open', 'rejected', 1234),
    ])
    await closeOldOrders()
    expect(tradier.getOrders).toHaveBeenCalled()
    expect(tradier.cancelOrders).not.toHaveBeenCalled()
  })

  it('Closes open buy-to-open orders', async () => {
    // @ts-ignore
    tradier.getOrders.mockReturnValue([
      generateOrderObject('AAPL', 20, 'call', 'buy_to_open', 'open', 1),
      generateOrderObject('MSFT', 20, 'put', 'buy_to_open', 'open', 2),
      generateOrderObject('TSLA', 20, 'call', 'buy_to_open', 'open', 3),
      generateOrderObject('BA', 20, 'put', 'buy_to_open', 'open', 4),
      generateOrderObject('T', 20, 'call', 'buy_to_open', 'open', 5),
      generateOrderObject('O', 20, 'put', 'buy_to_open', 'open', 6),
    ])
    await closeOldOrders()
    expect(tradier.getOrders).toHaveBeenCalled()
    expect(tradier.cancelOrders).toHaveBeenCalledWith([ 1, 2, 3, 4, 5, 6 ])
  })
})
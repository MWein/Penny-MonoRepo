import * as tradier from '@penny/tradier'
import { Position } from '@penny/tradier'
import { getUnderlying } from '@penny/option-symbol-parser'
import { sellPositions } from './sellPositions'
import { generateSymbol } from '@penny/test-helpers'
jest.mock('@penny/tradier')


describe('sellPositions', () => {
  beforeEach(() => {
    // @ts-ignore
    tradier.sellToClose = jest.fn()
  })

  it('Calls sell-to-close for each position given', async () => {
    const positions: Position[] = [
      {
        id: 1234,
        symbol: generateSymbol('AAPL', 'call', '2022-05-29', 69),
        quantity: 2,
        cost_basis: 400,
        date_acquired: '2022-04-29'
      },
      {
        id: 1234,
        symbol: generateSymbol('TSLA', 'put', '2022-05-29', 47),
        quantity: 1,
        cost_basis: 400,
        date_acquired: '2022-04-29'
      },
    ]

    await sellPositions(positions)

    expect(tradier.sellToClose).toHaveBeenCalledWith(
      getUnderlying(positions[0].symbol),
      positions[0].symbol,
      positions[0].quantity
    )
    expect(tradier.sellToClose).toHaveBeenCalledWith(
      getUnderlying(positions[1].symbol),
      positions[1].symbol,
      positions[1].quantity
    )
  })
})
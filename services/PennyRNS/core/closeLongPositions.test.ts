import * as tradier from '@penny/tradier'
import { closeLongPositions } from './closeLongPositions'
import { generatePositionObject } from '@penny/test-helpers'
jest.mock('@penny/tradier')

describe('closePositions', () => {
  beforeEach(() => {
    // @ts-ignore
    tradier.closePositionsIndividual = jest.fn()
    // @ts-ignore
    tradier.getPositions = jest.fn()
  })

  it('Does nothing if there are no open positions', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([])
    await closeLongPositions()
    expect(tradier.getPositions).toHaveBeenCalled()
    expect(tradier.closePositionsIndividual).not.toHaveBeenCalled()
  })

  it('Ignores stock positions', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 20, 'stock'),
      generatePositionObject('MSFT', 20, 'stock'),
    ])
    await closeLongPositions()
    expect(tradier.getPositions).toHaveBeenCalled()
    expect(tradier.closePositionsIndividual).not.toHaveBeenCalled()
  })

  it('Ignores short option positions', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', -2, 'call', 20, '2022-05-29', 1234, '2022-05-12', 180),
      generatePositionObject('MSFT', -1, 'put', 20, '2022-05-29', 1234, '2022-05-12', 180),
    ])
    await closeLongPositions()
    expect(tradier.getPositions).toHaveBeenCalled()
    expect(tradier.closePositionsIndividual).not.toHaveBeenCalled()
  })

  it('Closes long option positions', async () => {
    const positions = [
      generatePositionObject('AAPL', -2, 'call', 20, '2022-05-29', 1234, '2022-05-12', 180),
      generatePositionObject('AAPL', 2, 'call', 20, '2022-05-29', 1234, '2022-05-14', 180),
      generatePositionObject('MSFT', -1, 'put', 20, '2022-05-29', 1234, '2022-05-12', 180),
      generatePositionObject('TSLA', 1, 'put', 20, '2022-05-29', 1234, '2022-05-14', 180),
      generatePositionObject('MSFT', 190, 'stock'),
    ]
    // @ts-ignore
    tradier.getPositions.mockReturnValue(positions)
    await closeLongPositions()
    expect(tradier.getPositions).toHaveBeenCalled()
    expect(tradier.closePositionsIndividual).toHaveBeenCalledWith([
      positions[1],
      positions[3],
    ])
  })
})
import * as tradier from '@penny/tradier'
import { nuke } from './nuke'
import { generatePositionObject } from '@penny/test-helpers'
jest.mock('@penny/tradier')

describe('nuke', () => {
  beforeEach(() => {
    // @ts-ignore
    tradier.getPositions = jest.fn()
    // @ts-ignore
    tradier.closePositions = jest.fn()
  })

  it('Does nothing if there are no positions', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([])
    await nuke('all')
    expect(tradier.closePositions).not.toHaveBeenCalled()
  })

  const mockPositions = [
    // Long
    generatePositionObject('AAPL', 1, 'put', 103, '2021-01-01', 1234, '2021-01-01', 162.5),
    generatePositionObject('AAPL', -1, 'put', -58, '2021-01-01', 1234, '2021-01-01', 160),

    // Short
    generatePositionObject('AAPL', 1, 'call', 8, '2021-01-01', 1234, '2021-01-02', 175),
    generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-02', 172.5),
  ]

  it('Closes all positions', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue(mockPositions)
    await nuke('all')
    expect(tradier.closePositions).toHaveBeenCalledWith([
      {
        cost_basis: 103,
        date_acquired: '2021-01-01',
        id: 1234,
        quantity: 1,
        symbol: 'AAPL210101P00162500'
      },
      {
        cost_basis: -58,
        date_acquired: '2021-01-01',
        id: 1234,
        quantity: -1,
        symbol: 'AAPL210101P00160000'
      },
      {
        cost_basis: 8,
        date_acquired: '2021-01-01',
        id: 1234,
        quantity: 1,
        symbol: 'AAPL210102C00175000'
      },
      {
        cost_basis: -20,
        date_acquired: '2021-01-01',
        id: 1234,
        quantity: -1,
        symbol: 'AAPL210102C00172500'
      }
    ])
  })

  it('Only closes long', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue(mockPositions)
    await nuke('long')
    expect(tradier.closePositions).toHaveBeenCalledWith([
      {
        cost_basis: 103,
        date_acquired: '2021-01-01',
        id: 1234,
        quantity: 1,
        symbol: 'AAPL210101P00162500'
      },
      {
        cost_basis: -58,
        date_acquired: '2021-01-01',
        id: 1234,
        quantity: -1,
        symbol: 'AAPL210101P00160000'
      },
    ])
  })

  it('Only closes short', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue(mockPositions)
    await nuke('short')
    expect(tradier.closePositions).toHaveBeenCalledWith([
      {
        cost_basis: 8,
        date_acquired: '2021-01-01',
        id: 1234,
        quantity: 1,
        symbol: 'AAPL210102C00175000'
      },
      {
        cost_basis: -20,
        date_acquired: '2021-01-01',
        id: 1234,
        quantity: -1,
        symbol: 'AAPL210102C00172500'
      }
    ])
  })
})
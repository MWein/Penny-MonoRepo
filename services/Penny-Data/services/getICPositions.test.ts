import * as tradier from '@penny/tradier'
import { getICPositions } from './getICPositions'
import { generatePositionObject } from '@penny/test-helpers'
jest.mock('@penny/tradier')


describe('getICPositions', () => {
  beforeEach(() => {
    // @ts-ignore
    tradier.getPositions = jest.fn()
    // @ts-ignore
    tradier.getPrices = jest.fn()
  })


  it('Returns empty array if there are no positions', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([])
    const result = await getICPositions()
    expect(result).toEqual([])
  })


  it('Returns gain/loss of zero if price call fails', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-01-01', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-01', 172.5),
    ])
    // @ts-ignore
    tradier.getPrices.mockReturnValue([])
    const result = await getICPositions()
    expect(result).toEqual([
      {
        gainLoss: 0,
        hasCall: true,
        hasPut: false,
        maxGain: 12,
        maxLoss: -238,
        side: 'short',
        ticker: 'AAPL',
      }
    ])
  })


  it('Happy path with current gain/loss, single position', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-01-01', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-01', 172.5),
    ])
    // @ts-ignore
    tradier.getPrices.mockReturnValue([
      {
        symbol: 'AAPL210101C00175000',
        price: 0.12,
      },
      {
        symbol: 'AAPL210101C00172500',
        price: 0.14,
      }
    ])
    const result = await getICPositions()
    expect(result).toEqual([
      {
        gainLoss: 10,
        hasCall: true,
        hasPut: false,
        maxGain: 12,
        maxLoss: -238,
        side: 'short',
        ticker: 'AAPL',
      }
    ])
  })


  it('Happy path with current gain/loss, multiple positions, same ticker, diff exp dates', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-01-01', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-01', 172.5),

      generatePositionObject('AAPL', 1, 'call', 52, '2021-01-01', 1234, '2021-01-02', 170),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-02', 172.5),
    ])
    // @ts-ignore
    tradier.getPrices.mockReturnValue([
      {
        symbol: 'AAPL210101C00175000',
        price: 0.12,
      },
      {
        symbol: 'AAPL210101C00172500',
        price: 0.14,
      }
    ])
    const result = await getICPositions()
    expect(result).toEqual([
      {
        gainLoss: 10,
        hasCall: true,
        hasPut: false,
        maxGain: 12,
        maxLoss: -238,
        side: 'short',
        ticker: 'AAPL',
      },
      {
        gainLoss: 0,
        hasCall: true,
        hasPut: false,
        maxGain: 218,
        maxLoss: -32,
        side: 'long',
        ticker: 'AAPL',
      }
    ])
  })
})
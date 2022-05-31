import * as tradier from '@penny/tradier'
import { closeExpiringPositions } from './closeExpiringPositions'
import { generatePositionObject } from '@penny/test-helpers'
jest.mock('@penny/tradier')

describe('closeExpiringPositions', () => {
  beforeEach(() => {
    // @ts-ignore
    tradier.getPositions = jest.fn()
    // @ts-ignore
    tradier.closePositionsIndividual = jest.fn()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('Does nothing if there are no positions', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([])
    await closeExpiringPositions()
    expect(tradier.closePositionsIndividual).not.toHaveBeenCalled()
  })

  it('Does nothing if there are no expiring positions', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-10-12').getTime())
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 52, '2021-01-01', 1234, '2022-10-14', 170),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2022-10-14', 172.5),
    ])
    await closeExpiringPositions()
    expect(tradier.closePositionsIndividual).not.toHaveBeenCalled()
  })

  it('Closes expiring positions', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-10-12').getTime())
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 52, '2021-01-01', 1234, '2022-10-12', 170),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2022-10-12', 172.5),
      generatePositionObject('AAPL', 1, 'call', 52, '2021-01-01', 1234, '2022-10-14', 170),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2022-10-14', 172.5),
    ])
    await closeExpiringPositions()
    expect(tradier.closePositionsIndividual).toHaveBeenCalledWith([
      {
        cost_basis: 52,
        date_acquired: '2021-01-01',
        id: 1234,
        quantity: 1,
        symbol: 'AAPL221012C00170000'
      },
      {
        cost_basis: -20,
        date_acquired: '2021-01-01',
        id: 1234,
        quantity: -1,
        symbol: 'AAPL221012C00172500'}
    ])
  })
})
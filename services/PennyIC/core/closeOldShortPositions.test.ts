import * as tradier from '@penny/tradier'
import * as closePositionsUtil from '../common/closePositions'
import { closeOldShortPositions } from './closeOldShortPositions'
import { generatePositionObject } from '@penny/test-helpers'
jest.mock('@penny/tradier')

describe('closeOldShortPositions', () => {
  beforeEach(() => {
    // @ts-ignore
    tradier.getPositions = jest.fn()
    // @ts-ignore
    closePositionsUtil.closePositions = jest.fn()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('Does nothing if there arent any positions', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([])
    await closeOldShortPositions()
    expect(closePositionsUtil.closePositions).not.toHaveBeenCalled()
  })


  it('Ignores long positions less than 8 days from expiration', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-10-12').getTime())
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 52, '2021-01-01', 1234, '2022-10-14', 170),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2022-10-14', 172.5),
    ])
    await closeOldShortPositions()
    expect(closePositionsUtil.closePositions).not.toHaveBeenCalled()
  })


  it('Ignores newer short positions', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-10-12').getTime())
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-01-01', 1234, '2022-10-22', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2022-10-22', 172.5),
    ])
    await closeOldShortPositions()
    expect(closePositionsUtil.closePositions).not.toHaveBeenCalled()
  })


  it('Closes short positions less than 8 days from expiration', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-10-12').getTime())
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-01-01', 1234, '2022-10-19', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2022-10-19', 172.5),
    ])
    await closeOldShortPositions()
    expect(closePositionsUtil.closePositions).toHaveBeenCalledWith([
      {
        cost_basis: 8,
        date_acquired: '2021-01-01',
        id: 1234,
        quantity: 1,
        symbol: 'AAPL221019C00175000'
      },
      {
        cost_basis: -20,
        date_acquired: '2021-01-01',
        id: 1234,
        quantity: -1,
        symbol: 'AAPL221019C00172500'
      }
    ])
  })
})
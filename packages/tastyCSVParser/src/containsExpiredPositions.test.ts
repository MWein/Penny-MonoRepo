import { containsExpiredPositions } from './containsExpiredPositions'

import { groupPositions } from './groupPositions'
import { createHistoryObj } from './testHelpers/createHistoryObject'


describe('containsExpiredPositions', () => {
  beforeEach(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2022-05-29'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })


  it('Returns false if no open positions', () => {
    const history = [
      createHistoryObj(new Date('2022-01-02'), 'AAPL', 'Buy', 'Close', 1, '2022-01-01', 180, 'Call', 0.12, 1.00, -12),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    const positions = groupPositions(history)
    expect(containsExpiredPositions(positions)).toEqual(false)
  })

  it('Returns false if no expired positions', () => {
    const history = [
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-06-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    const positions = groupPositions(history)
    expect(containsExpiredPositions(positions)).toEqual(false)
  })

  it('Returns false if position is expiring today, but not expired', () => {
    const history = [
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-05-29', 180, 'Call', 0.45, 1.00, 45),
    ]
    const positions = groupPositions(history)
    expect(containsExpiredPositions(positions)).toEqual(false)
  })

  it('Returns true if expired positions', () => {
    const history = [
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-05-28', 180, 'Call', 0.45, 1.00, 45),
    ]
    const positions = groupPositions(history)
    expect(containsExpiredPositions(positions)).toEqual(true)
  })
})
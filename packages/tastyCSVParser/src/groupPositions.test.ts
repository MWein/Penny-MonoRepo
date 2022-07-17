import { groupPositions } from './groupPositions'
import { createHistoryObj } from './testHelpers/createHistoryObject'


describe('groupPositions', () => {
  it('Groups single position (all transactions on the same date)', () => {
    const history = [
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 170, 'Put', 0.45, 1.00, 45),
    ]
    expect(groupPositions(history)).toMatchSnapshot()
  })


  it('Groups single position with 1 bought and sold leg', () => {
    const history = [
      createHistoryObj(new Date('2022-01-02'), 'AAPL', 'Buy', 'Close', 1, '2022-01-01', 180, 'Call', 0.12, 1.00, -12),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    expect(groupPositions(history)).toMatchSnapshot()
  })


  it('Groups multiple positions (different underlyings)', () => {
    const history = [
      createHistoryObj(new Date('2022-01-02'), 'AAPL', 'Buy', 'Close', 1, '2022-01-01', 180, 'Call', 0.12, 1.00, -12),
      createHistoryObj(new Date('2022-01-02'), 'TSLA', 'Buy', 'Close', 1, '2022-01-01', 180, 'Call', 0.12, 1.00, -12),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-01'), 'TSLA', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    expect(groupPositions(history)).toMatchSnapshot()
  })


  it('Shows a position as open if legs are open', () => {
    const history = [
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    expect(groupPositions(history)[0].state).toEqual('Open')
    expect(groupPositions(history)).toMatchSnapshot()
  })


  it('Leg shows as long if bought to open', () => {
    const history = [
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Buy', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, -45),
    ]
    expect(groupPositions(history)[0].legs[0].side).toEqual('Long')
    expect(groupPositions(history)).toMatchSnapshot()
  })


  it('Leg shows as short if sold to open', () => {
    const history = [
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    expect(groupPositions(history)[0].legs[0].side).toEqual('Short')
    expect(groupPositions(history)).toMatchSnapshot()
  })


  it('Shows a position as open if legs are open but some legs have been closed', () => {
    const history = [
      createHistoryObj(new Date('2022-01-02'), 'AAPL', 'Buy', 'Close', 1, '2022-01-01', 180, 'Call', 0.12, 1.00, -12),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    expect(groupPositions(history)[0].state).toEqual('Open')
    expect(groupPositions(history)).toMatchSnapshot()
  })


  it('Shows a position as closed if all legs were closed out', () => {
    const history = [
      createHistoryObj(new Date('2022-01-02'), 'AAPL', 'Buy', 'Close', 1, '2022-01-01', 180, 'Call', 0.12, 1.00, -12),
      createHistoryObj(new Date('2022-01-02'), 'AAPL', 'Buy', 'Close', 1, '2022-01-01', 180, 'Call', 0.12, 1.00, -12),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    expect(groupPositions(history)[0].state).toEqual('Closed')
    expect(groupPositions(history)).toMatchSnapshot()
  })


  // // If a strangle was entered, and then one side was rolled, it would still be one position
  it('Groups date-overlapping history objects as a single positions', () => {
    const history = [
      createHistoryObj(new Date('2022-01-05'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 150, 'Call', 0.35, 1.00, 35),
      createHistoryObj(new Date('2022-01-05'), 'AAPL', 'Buy', 'Close', 1, '2022-01-01', 180, 'Call', 0.25, 1.00, -25),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 120, 'Put', 0.45, 1.00, 45),
    ]
    const result = groupPositions(history)
    expect(result.length).toEqual(1)
    expect(result).toMatchSnapshot()
  })


  // // If a strangle was entered and closed in May, and another one opened in June, they are separate positions
  it('Groups non-date-overlapping history objects as separate positions', () => {
    const history = [
      createHistoryObj(new Date('2022-01-07'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-07'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 120, 'Put', 0.45, 1.00, 45),

      createHistoryObj(new Date('2022-01-05'), 'AAPL', 'Buy', 'Close', 1, '2022-01-01', 180, 'Call', 0.25, 1.00, -25),
      createHistoryObj(new Date('2022-01-05'), 'AAPL', 'Buy', 'Close', 1, '2022-01-01', 120, 'Put', 0.15, 1.00, -15),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-01-01', 120, 'Put', 0.45, 1.00, 45),
    ]
    const result = groupPositions(history)
    expect(result.length).toEqual(2)
    expect(result).toMatchSnapshot()
  })
})
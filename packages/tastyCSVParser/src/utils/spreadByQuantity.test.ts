import { spreadHistoryByQuantity } from './spreadByQuantity'
import { createHistoryObj } from '../testHelpers/createHistoryObject'

describe('createHistoryObj', () => {
  it('Returns singletons for quantity of 1', () => {
    const history = [
      createHistoryObj(new Date('2021-01-01'), 'AAPL', 'Buy', 'Open', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45)
    ]
    expect(spreadHistoryByQuantity(history)).toEqual(history)
  })

  it('Returns multiples for quantity > 1', () => {
    const history = [
      createHistoryObj(new Date('2021-01-01'), 'AAPL', 'Buy', 'Open', 2, '2022-01-01', 180, 'Call', 0.45, 1.00, 45)
    ]
    expect(spreadHistoryByQuantity(history)).toMatchSnapshot()
  })

  it('Works for list of history objects', () => {
    const history = [
      createHistoryObj(new Date('2021-01-01'), 'AAPL', 'Buy', 'Open', 2, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2021-01-01'), 'TSLA', 'Sell', 'Close', 1, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2021-01-01'), 'MSFT', 'Sell', 'Open', 5, '2022-01-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    expect(spreadHistoryByQuantity(history)).toMatchSnapshot()
  })
})
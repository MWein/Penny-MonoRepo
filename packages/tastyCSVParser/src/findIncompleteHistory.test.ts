import { findIncompleteHistory } from './findIncompleteHistory'
import { createHistoryObj } from './testHelpers/createHistoryObject'


describe('findIncompleteHistory', () => {
  it('Returns nothing if all close events have corresponding opens', () => {
    const history = [
      createHistoryObj(new Date('2022-01-02'), 'AAPL', 'Sell', 'Close', 1, '2022-05-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Buy', 'Open', 1, '2022-05-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    expect(findIncompleteHistory(history)).toEqual([])
  })

  it('Ignores opens without closes', () => {
    const history = [
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Buy', 'Open', 1, '2022-05-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    expect(findIncompleteHistory(history)).toEqual([])
  })

  it('Returns underlying, expiration, type, strike, and quantity of closes without opens', () => {
    const history = [
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Close', 1, '2022-05-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-01'), 'TSLA', 'Sell', 'Close', 2, '2022-05-01', 980, 'Put', 0.45, 1.00, 45),
    ]
    expect(findIncompleteHistory(history)).toEqual([
      {
        underlying: 'AAPL',
        expiration: '2022-05-01',
        optionType: 'Call',
        strike: 180,
        quantity: 1,
      },
      {
        underlying: 'TSLA',
        expiration: '2022-05-01',
        optionType: 'Put',
        strike: 980,
        quantity: 2,
      },
    ])
  })

  it('Returns incomplete history with quantity of 2 if quantity of close is 3, but quantity of existing open is 1', () => {
    const history = [
      createHistoryObj(new Date('2022-01-02'), 'AAPL', 'Sell', 'Close', 3, '2022-05-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-05-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    expect(findIncompleteHistory(history)).toEqual([
      {
        underlying: 'AAPL',
        expiration: '2022-05-01',
        optionType: 'Call',
        strike: 180,
        quantity: 2,
      },
    ])
  })


  it('Returns incomplete history if an open exists, but its dated after a close event', () => {
    const history = [
      createHistoryObj(new Date('2022-01-02'), 'AAPL', 'Sell', 'Open', 1, '2022-05-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Close', 1, '2022-05-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    expect(findIncompleteHistory(history)).toEqual([
      {
        underlying: 'AAPL',
        expiration: '2022-05-01',
        optionType: 'Call',
        strike: 180,
        quantity: 1,
      },
    ])
  })


  it('Returns incomplete history for multiple, duplicate close events with the proper quantity', () => {
    const history = [
      createHistoryObj(new Date('2022-01-02'), 'AAPL', 'Sell', 'Close', 1, '2022-05-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-02'), 'AAPL', 'Sell', 'Close', 1, '2022-05-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-02'), 'AAPL', 'Sell', 'Close', 1, '2022-05-01', 180, 'Call', 0.45, 1.00, 45),
      createHistoryObj(new Date('2022-01-01'), 'AAPL', 'Sell', 'Open', 1, '2022-05-01', 180, 'Call', 0.45, 1.00, 45),
    ]
    expect(findIncompleteHistory(history)).toEqual([
      {
        underlying: 'AAPL',
        expiration: '2022-05-01',
        optionType: 'Call',
        strike: 180,
        quantity: 2,
      },
    ])
  })
})
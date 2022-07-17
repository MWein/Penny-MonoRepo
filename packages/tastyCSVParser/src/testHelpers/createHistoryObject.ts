import { TastyHistory } from '../historyCSVToJson'

export const createHistoryObj = (
  date: Date,
  underlying: string,
  side: 'Buy' | 'Sell',
  action: 'Open' | 'Close',
  quantity: number,
  expiration: string,
  strike: number,
  optionType: 'Call' | 'Put',
  price: number,
  fees: number,
  amount: number,
): TastyHistory => ({
  date, underlying, side, action, quantity, expiration, strike, optionType, price, fees, amount,
})
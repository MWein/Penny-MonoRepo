import { verify } from "./verify"

export type TastyHistory = {
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
}


const reducer = (row): TastyHistory => {
  return {
    date: new Date(row['Date/Time']),
    underlying: row.Symbol,
    side: row['Buy/Sell'],
    action: row['Open/Close'],
    quantity: Number(row.Quantity),
    expiration: new Date(row['Expiration Date']).toISOString().split('T')[0],
    strike: Number(row.Strike),
    optionType: row['Call/Put'] === 'C' ? 'Call' : 'Put',
    price: Number(row.Price),
    fees: Number(row.Fees),
    amount: Number(row.Amount),
  }
}


export const historyCSVToJson = (csvData: string): TastyHistory[] => {
  if (!verify(csvData)) {
    return []
  }

  const csvHeader = csvData.slice(0, csvData.indexOf("\n")).split(",")
  return csvData.slice(csvData.indexOf("\n") + 1).split("\n")
    .map(row => row.split(','))
    .map(row => {
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = row[index];
        return object;
      }, {})
      return obj
    })
    .filter(row => row['Transaction Code'] === 'Trade')
    .map(row => reducer(row))
}
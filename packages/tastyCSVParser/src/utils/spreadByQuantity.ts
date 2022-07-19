import { TastyHistory } from '../historyCSVToJson'


export const spreadHistoryByQuantity = (history: TastyHistory[]): TastyHistory[] => {
  return history.flatMap(history => {
    const quantity = history.quantity
    // TODO Verify that price is multiplied by quantity from data source
    // For now, we will assume it doesn't
    const price = history.price// / quantity

    // TODO Verify that fees is multiplied by quantity from data source
    // For now, we assume it does
    const fees = history.fees / quantity

    const amount = history.amount / quantity

    const spreadHistory = []
    for (let x = 0; x < quantity; x++) {
      spreadHistory.push({
        ...history,
        // @ts-ignore
        price, fees, amount, quantity: 1
      })
    }

    return spreadHistory
  })
}
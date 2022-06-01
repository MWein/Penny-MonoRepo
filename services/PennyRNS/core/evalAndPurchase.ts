import * as tradier from '@penny/tradier'
import { getUnderlying } from '@penny/option-symbol-parser'

export const evalAndPurchase = async (option) => {
  let shouldPurchase = false

  // Extremely low volatility options
  if (option.perc <= 1 && option.price >= 10 && option.premium >= 30 && option.premium < 1000) {
    shouldPurchase = true
  }

  // Extremely high volatility put options
  // Commenting out for now, not really doing it today
  // if (option.type === 'put' && option.perc >= 5 && option.price >= 5 && option.premium <= 1000) {
  //   shouldPurchase = true
  // }

  if (shouldPurchase) {
    const limitPrice = Number(((option.premium + 5) / 100).toFixed(2))

    const underlying = getUnderlying(option.symbol)
    await tradier.buyToOpen(underlying, option.symbol, 1, limitPrice)
  }
}
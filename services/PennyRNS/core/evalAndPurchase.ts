import * as tradier from '@penny/tradier'
import { getUnderlying } from '@penny/option-symbol-parser'

export const evalAndPurchase = async (option) => {
  if (option.perc <= 1 && option.price >= 10 && option.premium >= 30 && option.premium < 1000) {
    const limitPrice = Number(((option.premium + 15) / 100).toFixed(2))

    const underlying = getUnderlying(option.symbol)
    await tradier.buyToOpen(underlying, option.symbol, 1, limitPrice)
  }
}
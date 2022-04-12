require('dotenv').config({ path: '../../../.env' })
import { isOption } from '@penny/option-symbol-parser'
import * as tradier from '@penny/tradier'


const checkLongOnly = async () => {
  const gainLoss = await tradier.getGainLoss()
  const optionsOnly = gainLoss.filter(x => isOption(x.symbol))
  const longOnly = optionsOnly.filter(x => x.quantity > 0)

  const startDate = new Date('2022-04-01')
  const recentOnly = longOnly.filter(x => {
    const date = new Date(x.open_date)
    return date > startDate
  })

  console.log(recentOnly.reduce((acc, x) => acc + x.gain_loss, 0))
}

checkLongOnly()
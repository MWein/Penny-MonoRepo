require('dotenv').config({ path: '../../../.env' })
import * as tradier from '@penny/tradier'
import { getUnderlying } from '@penny/option-symbol-parser'


const closeDupePositions = async () => {
  const positions = await tradier.getPositions()
  const dupePositions = positions.filter(x => Math.abs(x.quantity) > 1).map(x => ({
    ...x,
    quantity: (Math.abs(x.quantity) - 1) * (x.quantity < 0 ? -1 : 1)
  }))
  
  // console.log(dupePositions)

  // return
  const shortDupes = dupePositions.filter(x => x.quantity < 0)
  const longDupes = dupePositions.filter(x => x.quantity > 0)

  for (let x =0; x < shortDupes.length; x++) {
    const shortDupe = shortDupes[x]
    await tradier.buyToCloseMarket(getUnderlying(shortDupe.symbol), shortDupe.symbol, Math.abs(shortDupe.quantity))
  }

  for (let x = 0; x < shortDupes.length; x++) {
    const longDupe = longDupes[x]
    await tradier.sellToClose(getUnderlying(longDupe.symbol), longDupe.symbol, Math.abs(longDupe.quantity))
  }

  console.log(shortDupes)
}

closeDupePositions()
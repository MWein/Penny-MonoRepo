require('dotenv').config({ path: '../../../.env' })
import * as tradier from '@penny/tradier'
import { closeSpreads } from '../common/closeSpreads'


const closeAllPositions = async () => {
  console.log('Sending orders')
  const positions = await tradier.getPositions()
  const spreads = tradier.groupOptionsIntoSpreads(positions)
  const allSpreads = [ ...spreads.call.spreads, ...spreads.put.spreads ]

  await closeSpreads(allSpreads)
  console.log('Done')
}

closeAllPositions()
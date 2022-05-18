import * as tradier from '@penny/tradier'
import * as logger from '@penny/logger'
import { savePositions } from "./savePositions"
import { saveSnapshot } from "./saveSnapshot"
import { clearExpiredPositions } from "./clearExpiredPositions"
import { saveOptPrices } from './rns/saveOptPrices'


export const saveAllData = async () => {
  // Do not run in prod
  if (!process.env.BASEPATH.includes('sandbox')) {
    return
  }

  const isMarketOpen = await tradier.isMarketOpen()
  if (!isMarketOpen) {
    return
  }

  try {
    await clearExpiredPositions()
    await savePositions()
    await saveSnapshot()
    await logger.logCron('Snapshot', true)
  } catch (e) {
    console.log(e)
    await logger.logCron('Snapshot', false)
  }

  try {
    await saveOptPrices()
    await logger.logCron('RNS Snap', true)
  } catch (e) {
    console.log(e)
    await logger.logCron('RNS Snap', false)
  }
}
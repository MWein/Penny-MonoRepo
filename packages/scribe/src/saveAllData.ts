import * as tradier from '@penny/tradier'
import * as logger from '@penny/logger'
import { saveOptPrices } from './saveOptPrices'


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
    await saveOptPrices()
    await logger.logCron('RNS Snap', true)
  } catch (e) {
    console.log(e)
    await logger.logCron('RNS Snap', false)
  }
}
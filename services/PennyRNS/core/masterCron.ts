import { saveAndPurchase } from './saveAndPurchase'
import { closeOldOrders } from './closeOldOrders'
import { logCron, CronType } from '@penny/logger'
import * as tradier from '@penny/tradier'
import { sleep } from '@penny/sleep'

const cronFunc = async (func: Function, cronName: CronType) => {
  try {
    await func()
    logCron(cronName, true)
  } catch (e) {
    logCron(cronName, false, e.toString())
  }
}


const masterCron = async () => {
  const marketOpen = await tradier.isMarketOpen()
  if (!marketOpen) {
    return
  }

  // Open long options
  await cronFunc(saveAndPurchase, 'RNS Init')

  // TODO Purchase Stock
  // TODO Sell Covered Calls

  // 30 minutes
  sleep(1800)

  // Close open buy-to-open orders
  //await cronFunc(closeOldOrders, 'CloseOrds')
}


export {
  cronFunc,
  masterCron,
}
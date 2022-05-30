import { saveAndPurchase } from './saveAndPurchase'
import { logCron, CronType } from '@penny/logger'

const cronFunc = async (func: Function, cronName: CronType) => {
  try {
    await func()
    logCron(cronName, true)
  } catch (e) {
    logCron(cronName, false, e.toString())
  }
}


const masterCron = async () => {
  await cronFunc(saveAndPurchase, 'RNS Init')

  // TODO Purchase Stock
  // TODO Sell Covered Calls

}


export {
  cronFunc,
  masterCron,
}
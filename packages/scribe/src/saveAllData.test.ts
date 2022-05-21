import * as tradier from '@penny/tradier'
import * as logger from '@penny/logger'
import * as saveOptPricesUtil from './saveOptPrices'
import { saveAllData } from './saveAllData'
jest.mock('@penny/tradier')


describe('saveAllData', () => {
  beforeEach(() => {
    process.env.BASEPATH = 'https://sandbox.example.com'
    // @ts-ignore
    tradier.isMarketOpen = jest.fn().mockReturnValue(true)
    // @ts-ignore
    logger.logCron = jest.fn()
    // @ts-ignore
    saveOptPricesUtil.saveOptPrices = jest.fn()
  })

  it('Does nothing if in prod', async () => {
    process.env.BASEPATH = 'https://prod.example.com'
    await saveAllData()
    expect(tradier.isMarketOpen).not.toHaveBeenCalled()
    expect(saveOptPricesUtil.saveOptPrices).not.toHaveBeenCalled()
    expect(logger.logCron).not.toHaveBeenCalled()
  })

  it('Does nothing if market is closed', async () => {
    // @ts-ignore
    tradier.isMarketOpen.mockReturnValue(false)
    await saveAllData()
    expect(tradier.isMarketOpen).toHaveBeenCalled()
    expect(saveOptPricesUtil.saveOptPrices).not.toHaveBeenCalled()
    expect(logger.logCron).not.toHaveBeenCalled()
  })

  it('Logs cron failure if something throws in option data func', async () => {
    // @ts-ignore
    saveOptPricesUtil.saveOptPrices.mockImplementation(() => {
      const err = new Error()
      throw err
    })
    await saveAllData()
    expect(tradier.isMarketOpen).toHaveBeenCalled()
    expect(logger.logCron).toHaveBeenCalledWith('RNS Snap', false)
  })

  it('Happy path', async () => {
    await saveAllData()
    expect(tradier.isMarketOpen).toHaveBeenCalled()
    expect(saveOptPricesUtil.saveOptPrices).toHaveBeenCalled()
    expect(logger.logCron).toHaveBeenCalledWith('RNS Snap', true)
  })
})
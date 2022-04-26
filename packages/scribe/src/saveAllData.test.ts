import * as tradier from '@penny/tradier'
import * as logger from '@penny/logger'
import * as savePositionsUtil from "./savePositions"
import * as saveSnapshotUtil from "./saveSnapshot"
import * as clearExpiredUtil from "./clearExpiredPositions"
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
    savePositionsUtil.savePositions = jest.fn()
    // @ts-ignore
    saveSnapshotUtil.saveSnapshot = jest.fn()
    // @ts-ignore
    clearExpiredUtil.clearExpiredPositions = jest.fn()
  })

  it('Does nothing if in prod', async () => {
    process.env.BASEPATH = 'https://prod.example.com'
    await saveAllData()
    expect(tradier.isMarketOpen).not.toHaveBeenCalled()
    expect(savePositionsUtil.savePositions).not.toHaveBeenCalled()
    expect(saveSnapshotUtil.saveSnapshot).not.toHaveBeenCalled()
    expect(clearExpiredUtil.clearExpiredPositions).not.toHaveBeenCalled()
    expect(logger.logCron).not.toHaveBeenCalled()
  })

  it('Does nothing if market is closed', async () => {
    // @ts-ignore
    tradier.isMarketOpen.mockReturnValue(false)
    await saveAllData()
    expect(tradier.isMarketOpen).toHaveBeenCalled()
    expect(savePositionsUtil.savePositions).not.toHaveBeenCalled()
    expect(saveSnapshotUtil.saveSnapshot).not.toHaveBeenCalled()
    expect(clearExpiredUtil.clearExpiredPositions).not.toHaveBeenCalled()
    expect(logger.logCron).not.toHaveBeenCalled()
  })

  it('Logs cron failure if something throws', async () => {
    // @ts-ignore
    savePositionsUtil.savePositions.mockImplementation(() => {
      const err = new Error()
      throw err
    })
    await saveAllData()
    expect(tradier.isMarketOpen).toHaveBeenCalled()
    expect(logger.logCron).toHaveBeenCalledWith('Snapshot', false)
  })

  it('Happy path', async () => {
    await saveAllData()
    expect(tradier.isMarketOpen).toHaveBeenCalled()
    expect(savePositionsUtil.savePositions).toHaveBeenCalled()
    expect(saveSnapshotUtil.saveSnapshot).toHaveBeenCalled()
    expect(clearExpiredUtil.clearExpiredPositions).toHaveBeenCalled()
    expect(logger.logCron).toHaveBeenCalledWith('Snapshot', true)
  })
})
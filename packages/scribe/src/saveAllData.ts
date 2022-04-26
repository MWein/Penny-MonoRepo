import * as tradier from '@penny/tradier'
import * as logger from '@penny/logger'
import { savePositions } from "./savePositions"
import { saveSnapshot } from "./saveSnapshot"
import { clearExpiredPositions } from "./clearExpiredPositions"


export const saveAllData = async () => {
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
    await logger.logCron('Snapshot', false)
  }
}
import * as tradier from '@penny/tradier'
import * as logger from '@penny/logger'
import { getExpiration, isOption } from '@penny/option-symbol-parser'
import { closePositions } from '../common/closePositions'


export const closeExpiringPositions = async () => {
  logger.log('Closing expiring positions')

  const positions = await tradier.getPositions()
  const optionPositions = positions.filter(pos => isOption(pos.symbol))

  //const today = new Date().toISOString().split('T')[0]
  const today = '2022-04-06'
  const expiringToday = optionPositions.filter(pos => getExpiration(pos.symbol) === today)

  await closePositions(expiringToday)

  logger.log('Finished closing expiring positions')
}
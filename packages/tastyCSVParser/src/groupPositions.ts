import { TastyHistory } from './historyCSVToJson'
import { uniq } from 'lodash'
import { spreadHistoryByQuantity } from './utils/spreadByQuantity'
import { generateSymbol } from '@penny/test-helpers'

type TastyState = 'Open' | 'Closed'

export type TastyLeg = {
  state: TastyState,
  openDate: Date,
  closeDate: Date | null,
  symbol: string,
  side: 'Long' | 'Short',
  expiration: string,
  strike: number,
  premium: number,
  fees: number,
  realizedProfitLoss: number,
}

export type TastyPosition = {
  state: TastyState,
  underlying: string,
  openDate: Date,
  closeDate: Date | null,
  totalPremium: number,
  totalFees: number,
  realizedProfitLoss: number,
  legs: TastyLeg[]
}


const groupLegsIntoPositions = (underlying: string, legGroups: TastyLeg[][]): TastyPosition[] => {
  return legGroups.map(legs => {
    const isClosed = legs.every(leg => leg.state === 'Closed')
    const openDate = legs.map(leg => leg.openDate).sort()[0]
    const closeDate = isClosed ? legs.map(leg => leg.closeDate).filter(date => date).sort().reverse()[0] : null

    return {
      state: isClosed ? 'Closed' : 'Open',
      underlying,
      openDate,
      closeDate,
      totalPremium: legs.reduce((acc, leg) => acc + leg.premium, 0),
      totalFees: legs.reduce((acc, leg) => acc + leg.fees, 0),
      realizedProfitLoss: legs.reduce((acc, leg) => acc + leg.realizedProfitLoss, 0),
      legs
    }
  })
}


const groupPositionsForUnderlying = (underlying, history: TastyHistory[]) => {
  const underlyingHistory = spreadHistoryByQuantity(
    history
    .filter(history => history.underlying === underlying)
    .reverse()
  )

  const positions: TastyLeg[][] = []
  let currentLegs: TastyLeg[] = []


  underlyingHistory.forEach(history => {
    // @ts-ignore
    const symbol = generateSymbol(history.underlying, history.optionType.toLowerCase(), history.expiration, history.strike)

    if (history.action === 'Open') {
      currentLegs.push({
        state: 'Open',
        symbol,
        openDate: history.date,
        closeDate: null,
        side: history.side === 'Buy' ? 'Long' : 'Short',
        expiration: history.expiration,
        strike: history.strike,
        premium: history.amount,
        fees: history.fees,
        realizedProfitLoss: 0,
      })
    }
    
    if (history.action === 'Close') {
      const index = currentLegs.findIndex(leg => leg.symbol === symbol && leg.state === 'Open')
      const editLeg = currentLegs[index]
      currentLegs[index] = {
        ...editLeg,
        state: 'Closed',
        closeDate: history.date,
        realizedProfitLoss: editLeg.premium + history.amount
      }
    }

    // Move to closed if all current legs are closed
    if (currentLegs.every(leg => leg.state === 'Closed')) {
      positions.push(currentLegs)
      currentLegs = []
    }
  })

  if (currentLegs.length > 0) {
    positions.push(currentLegs)
  }
  return positions
}



export const groupPositions = (history: TastyHistory[]) => uniq(
  history
    .map(hist => hist.underlying))
    .flatMap(symbol => groupLegsIntoPositions(symbol, groupPositionsForUnderlying(symbol, history))
)

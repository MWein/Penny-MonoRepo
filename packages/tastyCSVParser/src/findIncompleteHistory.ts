/*
  I want to be able to filter history by close date in a certain month or year.
  I may have to rely on history obtained from the database for this.
  The problem is that positions could have been opened in the previous month or year.
  This function will look at position close events, and if their corresponding opens are not present
    it will return the underlying symbol, expiration date, type, strike, and quantity. These will be used to retrieve
    the corresponding open event in the database if it's outside of the search range.
*/

import { TastyHistory } from './historyCSVToJson'
import { uniqWith, isEqual } from 'lodash'
import { spreadHistoryByQuantity } from './utils/spreadHistoryByQuantity'


export type MissingTastyHistory = {
  underlying: string,
  expiration: string,
  optionType: 'Call' | 'Put',
  strike: number,
  quantity: number,
}


type IncompleteHistoryAcc = {
  remainingOpenEvents: TastyHistory[],
  missingHistory: MissingTastyHistory[],
}


const isCorrespondingHistory = (openEvent: TastyHistory, closeEvent: TastyHistory) =>
  openEvent.underlying === closeEvent.underlying
  && openEvent.expiration === closeEvent.expiration
  && openEvent.strike === closeEvent.strike
  && openEvent.optionType === closeEvent.optionType
  && closeEvent.date.valueOf() > openEvent.date.valueOf()


// History was spread by quantity at the beginning of the findIncomplete function
const combineAlikeIncompleteHistory = (missingHistory: MissingTastyHistory[]) =>
  uniqWith(missingHistory, isEqual).map(baseHistory => ({
    ...baseHistory,
    quantity: missingHistory.filter(history => isEqual(baseHistory, history)).length
  }))


export const findIncompleteHistory = (history: TastyHistory[]): MissingTastyHistory[] => {
  const spreadHistory = spreadHistoryByQuantity(history)
  const openEvents = spreadHistory.filter(hist => hist.action === 'Open')
  const closeEvents = spreadHistory.filter(hist => hist.action === 'Close')

  const results = closeEvents.reduce((acc: IncompleteHistoryAcc, closeEvent: TastyHistory) => {
    const correspondingOpenIndex = acc.remainingOpenEvents
      .findIndex(openEvent => isCorrespondingHistory(openEvent, closeEvent))

    if (correspondingOpenIndex === -1) {
      return {
        ...acc,
        missingHistory: [
          ...acc.missingHistory,
          {
            underlying: closeEvent.underlying,
            expiration: closeEvent.expiration,
            optionType: closeEvent.optionType,
            strike: closeEvent.strike,
            quantity: closeEvent.quantity,
          }
        ]
      }
    }

    // Remove the found open event
    return {
      ...acc,
      remainingOpenEvents: acc.remainingOpenEvents.filter((_, index) => index !== correspondingOpenIndex),
    }
  }, {
    remainingOpenEvents: openEvents,
    missingHistory: [],
  })

  return combineAlikeIncompleteHistory(results.missingHistory)
}
import { isOption, getType, getStrike, getUnderlying } from '@penny/option-symbol-parser'
import { Position } from '.'


// If quantity (math.abs) is 2, there should be 2 of the same symbol
const optionSymbolsSpreadOut = (options: Position[]) =>
  options.reduce((acc, opt) => [
    ...acc,
    ...Array(Math.abs(opt.quantity)).fill(opt.symbol)
  ], [])


const getSymbolsOfType = (options: Position[], type: 'call' | 'put', longOrShort: 'long' | 'short') => {
  const quantityFunc = longOrShort === 'long' ? opt => opt.quantity > 0 : opt => opt.quantity < 0
  return optionSymbolsSpreadOut(
    options.filter(x => quantityFunc(x) && getType(x.symbol) === type)
  )
}


type Spread = {
  short: string,
  long: string,
}
type SpreadGroupResult = {
  spreads: Spread[],
  longOptsLeft: string[],
  lonelyShorts: string[]
}

const groupIntoSpreads = (longOptSymbols: string[], shortOptSymbols: string[], type: 'call' | 'put') : SpreadGroupResult => {
  const longFilterFunc = type === 'call' ?
    (shortOpt, opt) => getStrike(opt) > getStrike(shortOpt)
    : (shortOpt, opt) => getStrike(opt) < getStrike(shortOpt)

  const longSortFunc = type === 'call' ?
    (a, b) => getStrike(a) - getStrike(b)
    : (a, b) => getStrike(b) - getStrike(a)

  return shortOptSymbols.reduce((acc, shortOpt) => {
    const underlying = getUnderlying(shortOpt)
    const longsWithCompatibleStrike =
      acc.longOptsLeft.filter(x => getUnderlying(x) === underlying && longFilterFunc(shortOpt, x))
        .sort(longSortFunc)

    if (longsWithCompatibleStrike.length === 0) {
      return {
        ...acc,
        lonelyShorts: [ ...acc.lonelyShorts, shortOpt ]
      }
    }

    const longOpt = longsWithCompatibleStrike[0]

    const newSpreads = [
      ...acc.spreads,
      {
        long: longOpt,
        short: shortOpt,
      }
    ]

    // Splice isn't working right for some reason
    // Modified filter, only removes first occurence of longOpt in case there are multiple
    const { newLongOptsLeft } = acc.longOptsLeft.reduce((acc, x) => {
      return !acc.removed && x === longOpt ?
        { ...acc, removed: true }
        : { ...acc, newLongOptsLeft: [ ...acc.newLongOptsLeft, x ] }
    }, {
      newLongOptsLeft: [],
      removed: false
    })


    return {
      ...acc,
      spreads: newSpreads,
      longOptsLeft: newLongOptsLeft,
    }
  }, {
    spreads: [],
    longOptsLeft: longOptSymbols,
    lonelyShorts: []
  })
}


type CombinedSpreadGroupResult = {
  call: SpreadGroupResult,
  put: SpreadGroupResult,
}


export const groupOptionsIntoSpreads = (positions: Position[]) : CombinedSpreadGroupResult => {
  const options = positions.filter(pos => isOption(pos.symbol))

  const shortPuts = getSymbolsOfType(options, 'put', 'short')
  const longPuts = getSymbolsOfType(options, 'put', 'long')

  const shortCalls = getSymbolsOfType(options, 'call', 'short')
  const longCalls = getSymbolsOfType(options, 'call', 'long')

  const putSpreadResults = groupIntoSpreads(longPuts, shortPuts, 'put')
  const callSpreadResults = groupIntoSpreads(longCalls, shortCalls, 'call')

  return {
    call: callSpreadResults,
    put: putSpreadResults,
  }
}
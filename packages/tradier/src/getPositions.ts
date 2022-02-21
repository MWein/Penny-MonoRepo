import { isOption, getType } from '@penny/option-symbol-parser'
import * as network from './network'


export type Position = {
  id: number,
  symbol: string
  quantity: number,
  cost_basis: number,
  date_acquired: string,
}


export const filterForOptionableStockPositions = (positions: Position[]) : Position[] =>
  positions.filter(pos => !isOption(pos.symbol) && pos.quantity >= 100)

export const filterForShortPutPositions = (positions: Position[]) : Position[] =>
  positions.filter(pos => getType(pos.symbol) === 'put' && pos.quantity < 0)

export const filterForShortCallPositions = (positions: Position[]) : Position[] =>
  positions.filter(pos => getType(pos.symbol) === 'call' && pos.quantity < 0)


export const getPositions = async () : Promise<Position[]> => {
  const url = `accounts/${process.env.ACCOUNTNUM}/positions`
  const response = await network.get(url)
  if (response.positions === 'null') {
    return []
  }
  if (Array.isArray(response.positions.position)) {
    return response.positions.position
  } else {
    return [ response.positions.position ]
  }
}
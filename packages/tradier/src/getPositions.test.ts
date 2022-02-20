import * as network from './network'
import {
  filterForOptionableStockPositions,
  filterForShortPutPositions,
  filterForShortCallPositions,
  getPositions,
} from './getPositions'
import { generatePositionObject } from '@penny/test-helpers'


describe('Filter functions', () => {
  const positions = [
    generatePositionObject('AAPL', 50, 'stock'),
    generatePositionObject('MSFT', 99, 'stock'),
    generatePositionObject('FB', 100, 'stock'),
    generatePositionObject('AXON', 240, 'stock'),
    generatePositionObject('SFIX', -1, 'call'),
    generatePositionObject('IBKR', 1, 'call'),
    generatePositionObject('ZNGA', -7, 'put'), // Short put
    generatePositionObject('GME', 19, 'put'), // Long put
  ]

  it('filterForOptionableStockPositions', () => {
    expect(filterForOptionableStockPositions(positions)).toEqual([
      generatePositionObject('FB', 100, 'stock'),
      generatePositionObject('AXON', 240, 'stock'),
    ])
  })

  it('filterForShortPutPositions', () => {
    expect(filterForShortPutPositions(positions)).toEqual([
      generatePositionObject('ZNGA', -7, 'put'),
    ])
  })

  it('filterForShortCallPositions', () => {
    expect(filterForShortCallPositions(positions)).toEqual([
      generatePositionObject('SFIX', -1, 'call'),
    ])
  })
})


describe('getPositions', () => {
  beforeEach(() => {
    // @ts-ignore
    network.get = jest.fn()
  })

  it('Creates the URL using the account number env', async () => {
    process.env.ACCOUNTNUM = 'somethingsomthing'
    // @ts-ignore
    network.get.mockReturnValue({
      positions: 'null'
    })
    await getPositions()
    expect(network.get).toHaveBeenCalledWith('accounts/somethingsomthing/positions')
  })

  it('Returns empty array if Tradier returns null', async () => {
    // @ts-ignore
    network.get.mockReturnValue({
      positions: 'null'
    })
    const positions = await getPositions()
    expect(positions).toEqual([])
  })

  it('Returns list of positions, single position', async () => {
    const response = {
      positions: {
        position: generatePositionObject('AAPL', 1, 'stock', 207.01)
      }
    }
    // @ts-ignore
    network.get.mockReturnValue(response)

    const positions = await getPositions()
    expect(positions).toEqual([ response.positions.position ])
  })

  it('Returns list of positions, multiple positions', async () => {
    const response = {
      positions: {
        position: [
          generatePositionObject('AAPL', 1, 'stock', 207.01),
          generatePositionObject('FB', 1, 'stock', 173.04),
        ]
      }
    }
    // @ts-ignore
    network.get.mockReturnValue(response)

    const positions = await getPositions()
    expect(positions).toEqual(response.positions.position)
  })
})
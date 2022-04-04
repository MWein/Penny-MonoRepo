import { groupOptionsIntoSpreads } from './groupIntoSpreads'
import { generatePositionObject } from '@penny/test-helpers'

describe('groupOptionsIntoSpreads', () => {
  it('Returns empty if given empty array', () => {
    expect(groupOptionsIntoSpreads([])).toEqual({
      call: {
        lonelyShorts: [],
        longOptsLeft: [],
        spreads: [],
      },
      put: {
        lonelyShorts: [],
        longOptsLeft: [],
        spreads: [],
      },
    })
  })

  it('Returns grouping for evenly distrubuted spreads', () => {
    const positions = [
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-05-05', 100),
      generatePositionObject('AAPL', 1, 'call', 20, '2021-01-01', 1234, '2021-05-05', 101),
      generatePositionObject('AAPL', -1, 'put', -20, '2021-01-01', 1234, '2021-05-05', 99),
      generatePositionObject('AAPL', 1, 'put', 20, '2021-01-01', 1234, '2021-05-05', 98),
    ]
    expect(groupOptionsIntoSpreads(positions)).toEqual({
      call: {
        lonelyShorts: [],
        longOptsLeft: [],
        spreads: [
          {
            long: 'AAPL210505C00101000',
            short: 'AAPL210505C00100000',
          },
        ],
      },
      put: {
        lonelyShorts: [],
        longOptsLeft: [],
        spreads: [
          {
            long: 'AAPL210505P00098000',
            short: 'AAPL210505P00099000',
          }
        ],
      },
    })
  })

  it('Returns multiple spread objects for quantity > 1', () => {
    const positions = [
      generatePositionObject('AAPL', -2, 'call', -20, '2021-01-01', 1234, '2021-05-05', 100),
      generatePositionObject('AAPL', 2, 'call', 20, '2021-01-01', 1234, '2021-05-05', 101),
      generatePositionObject('AAPL', -2, 'put', -20, '2021-01-01', 1234, '2021-05-05', 99),
      generatePositionObject('AAPL', 2, 'put', 20, '2021-01-01', 1234, '2021-05-05', 98),
    ]
    expect(groupOptionsIntoSpreads(positions)).toEqual({
      call: {
        lonelyShorts: [],
        longOptsLeft: [],
        spreads: [
          {
            long: 'AAPL210505C00101000',
            short: 'AAPL210505C00100000',
          },
          {
            long: 'AAPL210505C00101000',
            short: 'AAPL210505C00100000',
          },
        ],
      },
      put: {
        lonelyShorts: [],
        longOptsLeft: [],
        spreads: [
          {
            long: 'AAPL210505P00098000',
            short: 'AAPL210505P00099000',
          },
          {
            long: 'AAPL210505P00098000',
            short: 'AAPL210505P00099000',
          },
        ],
      },
    })
  })

  it('If a short position doesnt have an accompanying long position, result as lonelyShort', () => {
    const positions = [
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-05-05', 100),
      generatePositionObject('AAPL', -1, 'put', -20, '2021-01-01', 1234, '2021-05-05', 99),
    ]
    expect(groupOptionsIntoSpreads(positions)).toEqual({
      call: {
        lonelyShorts: [ 'AAPL210505C00100000' ],
        longOptsLeft: [],
        spreads: [],
      },
      put: {
        lonelyShorts: [ 'AAPL210505P00099000' ],
        longOptsLeft: [],
        spreads: [],
      },
    })
  })

  it('If a long position doesnt have an accompanying short position, result in longOptsLeft', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'call', 20, '2021-01-01', 1234, '2021-05-05', 101),
      generatePositionObject('AAPL', 1, 'put', 20, '2021-01-01', 1234, '2021-05-05', 98),
    ]
    expect(groupOptionsIntoSpreads(positions)).toEqual({
      call: {
        lonelyShorts: [],
        longOptsLeft: [ 'AAPL210505C00101000' ],
        spreads: [],
      },
      put: {
        lonelyShorts: [],
        longOptsLeft: [ 'AAPL210505P00098000' ],
        spreads: [],
      },
    })
  })
})
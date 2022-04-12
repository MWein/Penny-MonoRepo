import { getSpreadOutcome } from './index'
import { generatePositionObject } from '@penny/test-helpers'

describe('getSpreadOutcome', () => {
  it('Returns all 0 if given empty array', () => {
    expect(getSpreadOutcome('AAPL', [])).toEqual({
      ticker: 'AAPL',
      side: 'indeterminate',
      maxLoss: 0,
      maxGain: 0,
      fullyCovered: true,
    })
  })

  it('Side is short for net-sold spread', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'call', 14, '2021-01-01', 1234, '2021-01-01', 100),
      generatePositionObject('AAPL', -1, 'call', -52, '2021-01-01', 1234, '2021-01-01', 100)
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result.side).toEqual('short')
  })

  it('Side is long for net-bought spread', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'call', 14, '2021-01-01', 1234, '2021-01-01', 100),
      generatePositionObject('AAPL', -1, 'call', -2, '2021-01-01', 1234, '2021-01-01', 100)
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result.side).toEqual('long')
  })

  it('Fully covered should be true if positions all have opposites', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'call', 14, '2021-01-01', 1234, '2021-01-01', 100),
      generatePositionObject('AAPL', -1, 'call', -2, '2021-01-01', 1234, '2021-01-01', 100),
      generatePositionObject('AAPL', 1, 'put', 14, '2021-01-01', 1234, '2021-01-01', 100),
      generatePositionObject('AAPL', -1, 'put', -2, '2021-01-01', 1234, '2021-01-01', 100),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result.fullyCovered).toEqual(true)
  })

  it('Fully covered should be false if positions dont all have opposites', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'call', 14, '2021-01-01', 1234, '2021-01-01', 100),
      generatePositionObject('AAPL', -1, 'call', -2, '2021-01-01', 1234, '2021-01-01', 100),
      generatePositionObject('AAPL', 2, 'put', 14, '2021-01-01', 1234, '2021-01-01', 100),
      generatePositionObject('AAPL', -1, 'put', -2, '2021-01-01', 1234, '2021-01-01', 100),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result.fullyCovered).toEqual(false)
  })


  // ********** Call and Put Spreads **********

  it('Max gain and loss correct for net bought call spread', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'call', 52, '2021-01-01', 1234, '2021-01-01', 170),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-01', 172.5),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'long',
      maxLoss: -32,
      maxGain: 218,
      fullyCovered: true,
    })
  })

  it('Max gain and loss correct for net bought put spread', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'put', 103, '2021-01-01', 1234, '2021-01-01', 162.5),
      generatePositionObject('AAPL', -1, 'put', -58, '2021-01-01', 1234, '2021-01-01', 160),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'long',
      maxLoss: -45,
      maxGain: 205,
      fullyCovered: true,
    })
  })

  it('Max gain and loss correct for net sold call spread', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'call', 8, '2021-01-01', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-01', 172.5),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'short',
      maxLoss: -238,
      maxGain: 12,
      fullyCovered: true,
    })
  })

  it('Max gain and loss correct for net sold put spread', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'put', 58, '2021-01-01', 1234, '2021-01-01', 160),
      generatePositionObject('AAPL', -1, 'put', -103, '2021-01-01', 1234, '2021-01-01', 162.5),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'short',
      maxLoss: -205,
      maxGain: 45,
      fullyCovered: true,
    })
  })


  // ********** Iron Condors **********

  it('Max gain and loss correct for net bought iron condor', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'call', 52, '2021-01-01', 1234, '2021-01-01', 170),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-01', 172.5),
      generatePositionObject('AAPL', 1, 'put', 103, '2021-01-01', 1234, '2021-01-01', 162.5),
      generatePositionObject('AAPL', -1, 'put', -58, '2021-01-01', 1234, '2021-01-01', 160),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'long',
      maxLoss: -77,
      maxGain: 173,
      fullyCovered: true,
    })
  })

  it('Max gain and loss correct for net sold iron condor', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'call', 8, '2021-01-01', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-01', 172.5),
      generatePositionObject('AAPL', -1, 'put', -103, '2021-01-01', 1234, '2021-01-01', 162.5),
      generatePositionObject('AAPL', 1, 'put', 58, '2021-01-01', 1234, '2021-01-01', 160),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'short',
      maxLoss: -193,
      maxGain: 57,
      fullyCovered: true,
    })
  })

  it('Max gain and loss correct for uneven net bought iron condor', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'call', 52, '2021-01-01', 1234, '2021-01-01', 170),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-01', 172.5),
      generatePositionObject('AAPL', 1, 'put', 103, '2021-01-01', 1234, '2021-01-01', 162.5),
      generatePositionObject('AAPL', -1, 'put', -34, '2021-01-01', 1234, '2021-01-01', 157.5),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'long',
      maxLoss: -101,
      maxGain: 399,
      fullyCovered: true,
    })
  })

  it('Max gain and loss correct for uneven net sold iron condor', () => {
    const positions = [
      generatePositionObject('AAPL', -1, 'call', -52, '2021-01-01', 1234, '2021-01-01', 170),
      generatePositionObject('AAPL', 1, 'call', 20, '2021-01-01', 1234, '2021-01-01', 172.5),
      
      generatePositionObject('AAPL', -1, 'put', -103, '2021-01-01', 1234, '2021-01-01', 162.5),
      generatePositionObject('AAPL', 1, 'put', 34, '2021-01-01', 1234, '2021-01-01', 157.5),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'short',
      maxLoss: -399,
      maxGain: 101,
      fullyCovered: true,
    })
  })



  // ********** Iron Butterflies **********

  it('Max gain and loss correct for net bought iron butterfly', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'call', 259, '2021-01-01', 1234, '2021-01-01', 165),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-01', 172.5),
      
      generatePositionObject('AAPL', 1, 'put', 180, '2021-01-01', 1234, '2021-01-01', 165),
      generatePositionObject('AAPL', -1, 'put', -58, '2021-01-01', 1234, '2021-01-01', 160),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'long',
      maxLoss: -361,
      maxGain: 389,
      fullyCovered: true,
    })
  })

  it('Max gain and loss correct for net sold iron butterfly', () => {
    const positions = [
      generatePositionObject('AAPL', -1, 'call', -259, '2021-01-01', 1234, '2021-01-01', 165),
      generatePositionObject('AAPL', 1, 'call', 20, '2021-01-01', 1234, '2021-01-01', 172.5),
      
      generatePositionObject('AAPL', -1, 'put', -180, '2021-01-01', 1234, '2021-01-01', 165),
      generatePositionObject('AAPL', 1, 'put', 58, '2021-01-01', 1234, '2021-01-01', 160),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'short',
      maxLoss: -389,
      maxGain: 361,
      fullyCovered: true,
    })
  })


  // ********** Straddles and Strangles **********

  it('Max gain should be Infinity and max loss the cost basis for long straddle', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'call', 259, '2021-01-01', 1234, '2021-01-01', 165),
      generatePositionObject('AAPL', 1, 'put', 180, '2021-01-01', 1234, '2021-01-01', 165),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'long',
      maxLoss: -439,
      maxGain: Infinity,
      fullyCovered: false,
    })
  })

  it('Max loss should be Infinity and max gain the cost basis for short straddle', () => {
    const positions = [
      generatePositionObject('AAPL', -1, 'call', -259, '2021-01-01', 1234, '2021-01-01', 165),
      generatePositionObject('AAPL', -1, 'put', -180, '2021-01-01', 1234, '2021-01-01', 165),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'short',
      maxLoss: -Infinity,
      maxGain: 439,
      fullyCovered: false,
    })
  })

  it('Max gain should be Infinity and max loss the cost basis for long strangle', () => {
    const positions = [
      generatePositionObject('AAPL', 1, 'call', 129, '2021-01-01', 1234, '2021-01-01', 167.5),
      generatePositionObject('AAPL', 1, 'put', 180, '2021-01-01', 1234, '2021-01-01', 165),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'long',
      maxLoss: -309,
      maxGain: Infinity,
      fullyCovered: false,
    })
  })

  it('Max loss should be Infinity and max gain the cost basis for short straddle', () => {
    const positions = [
      generatePositionObject('AAPL', -1, 'call', -129, '2021-01-01', 1234, '2021-01-01', 167.5),
      generatePositionObject('AAPL', -1, 'put', -180, '2021-01-01', 1234, '2021-01-01', 165),
    ]
    const result = getSpreadOutcome('AAPL', positions)
    expect(result).toEqual({
      ticker: 'AAPL',
      side: 'short',
      maxLoss: -Infinity,
      maxGain: 309,
      fullyCovered: false,
    })
  })
})
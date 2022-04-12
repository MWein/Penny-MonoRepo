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

  it('Max gain should be Infinity and max loss the cost basis for long straddle', () => {
    
  })

  it('Max loss should be Infinity and max gain the cost basis for short straddle', () => {
    
  })
})
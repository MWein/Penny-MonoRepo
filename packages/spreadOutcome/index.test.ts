import { getSpreadOutcome } from './index'
import { mockPo } from '@penny/test-helpers'

describe('getSpreadOutcome', () => {
  it.only('Returns all 0 if given empty array', () => {
    expect(getSpreadOutcome('AAPL', [])).toEqual({
      ticker: 'AAPL',
      side: 'indeterminate',
      maxLoss: 0,
      maxGain: 0,
      fullyCovered: true,
    })
  })

  it.only('Side is short for net-sold spread', () => {

  })

  it.only('Side is long for net-bought spread', () => {

  })

  it('Fully covered should be true if positions all have opposites', () => {

  })

  it('Fully covered should be false if positions dont all have opposites', () => {
    
  })

  it('Max gain and loss correct for net bought call spread', () => {

  })

  it('Max gain and loss correct for net bought put spread', () => {
    
  })

  it('Max gain and loss correct for net sold call spread', () => {

  })

  it('Max gain and loss correct for net sold put spread', () => {
    
  })

  it('Max gain and loss correct for net bought call spread', () => {

  })

  it('Max gain and loss correct for net bought iron condor', () => {
    
  })

  it('Max gain and loss correct for net sold iron condor', () => {
    
  })

  it('Max gain should be Infinity and max loss the cost basis for long straddle', () => {
    
  })

  it('Max loss should be Infinity and max gain the cost basis for short straddle', () => {
    
  })
})
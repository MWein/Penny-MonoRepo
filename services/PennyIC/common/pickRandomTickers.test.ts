import * as tradier from "@penny/tradier"
jest.mock('@penny/tradier')
import { pickRandomTickers } from './pickRandomTickers'
import { uniq } from 'lodash'

describe('pickRandomTickers', () => {
  beforeEach(() => {
    // @ts-ignore
    tradier.evaluateTicker = jest.fn()
  })

  it('Returns empty array if not given any tickers', async () => {
    const result = await pickRandomTickers([], 5, 1, '2022-06-03')
    expect(result).toEqual([])
  })

  it('Returns correct number of tickers if all pass evaluation', async () => {
    // @ts-ignore
    tradier.evaluateTicker.mockReturnValue({ valid: true })
    const candidates = [ 'AAPL', 'TSLA', 'BAC', 'MSFT', 'APPL', 'FAKE', 'FAKE2' ]
    const result = await pickRandomTickers(candidates, 5, 1, '2022-06-03')
    expect(result.length).toEqual(5)
    expect(uniq(result).length).toEqual(5)
    result.map(ticker => {
      // Expect them to be from the candidate pool
      expect(candidates.includes(ticker)).toEqual(true)
    })
    expect(tradier.evaluateTicker).toHaveBeenCalledTimes(5)

    // Can't match calls with any tickers to have to do this
    // @ts-ignore
    expect(tradier.evaluateTicker.mock.calls[0][1]).toEqual(1)
    // @ts-ignore
    expect(tradier.evaluateTicker.mock.calls[0][2]).toEqual('2022-06-03')
  })

  it('Returns correct number of tickers if a few do not pass evaluation', async () => {
    let failCount = 2
    // @ts-ignore
    tradier.evaluateTicker.mockImplementation(() => {
      if (failCount > 0) {
        failCount--
        return { valid: false }
      }
      return { valid: true }
    })

    const result = await pickRandomTickers([ 'AAPL', 'TSLA', 'BAC', 'MSFT', 'APPL', 'FAKE', 'FAKE2' ], 5, 1, '2022-06-03')
    expect(result.length).toEqual(5)
    expect(uniq(result).length).toEqual(5)
    expect(tradier.evaluateTicker).toHaveBeenCalledTimes(7) // 5 + 2 failures
  })

  it('Returns whatever tickers remain if less than number to choose from', async () => {
    // @ts-ignore
    tradier.evaluateTicker.mockReturnValue({ valid: true })
    const candidates = [ 'AAPL', 'TSLA' ]
    const result = await pickRandomTickers(candidates, 5, 1, '2022-06-03')
    expect(result.length).toEqual(2)
    expect(uniq(result).length).toEqual(2)
    result.map(ticker => {
      // Expect them to be from the candidate pool
      expect(candidates.includes(ticker)).toEqual(true)
    })
    expect(tradier.evaluateTicker).toHaveBeenCalledTimes(2)
  })
})
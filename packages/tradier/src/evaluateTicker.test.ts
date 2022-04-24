import { evaluateTicker } from './evaluateTicker'
import * as network from './network'


const mockResponse1 = {
  options: {
    option: [
      {
        symbol: 'AAPL123C321',
        root_symbol: 'AAPL',
        strike: 120,
        bid: 0.5,
        option_type: 'call',
        expiration_date: '2021-01-01',
        greeks: {
          delta: 0.18,
        }
      },
      {
        symbol: 'AAPL123C321',
        root_symbol: 'AAPL',
        strike: 125,
        bid: 0.5,
        option_type: 'call',
        expiration_date: '2021-01-01',
        greeks: {
          delta: 0.25,
        }
      },
      {
        symbol: 'AAPL321C321',
        root_symbol: 'AAPL',
        strike: 130,
        bid: 0.7,
        option_type: 'put',
        expiration_date: '2021-02-01',
        greeks: {
          delta: 0.49,
        }
      }
    ],
  }
}


describe('evaluateTicker', () => {
  beforeEach(() => {
    // @ts-ignore
    network.get = jest.fn()
  })

  it('Returns cached value if present, does not call main func', async () => {
    // @ts-ignore
    network.get.mockReturnValue({
      options: 'null'
    })

    const result1 = await evaluateTicker('AAPL', 5, '2022-06-03')
    const result2 = await evaluateTicker('AAPL', 5, '2022-06-03')

    expect(result1).toEqual({ valid: false, reason: 'Invalid' })
    expect(result1).toEqual(result2)

    // The cache should guarentee this is only called one time
    expect(network.get).toHaveBeenCalledTimes(1)
  })

  it('Returns invalid if an error is thrown by getOptionCHain, indicating an invalid ticker', async () => {
    // @ts-ignore
    network.get.mockImplementation(() => {
      const err = new Error('Oh no')
      throw err
    })
    const result = await evaluateTicker('AMZN', 1, '2022-06-03')
    expect(result).toEqual({ valid: false, reason: 'Invalid' })    
  })

  it('Returns invalid if the strikes are too wide', async () => {
    // @ts-ignore
    network.get.mockReturnValue(mockResponse1)
    const result = await evaluateTicker('AAPL', 1, '2022-06-03')
    expect(result).toEqual({ valid: false, reason: 'Strike too wide' })
  })

  it('Returns valid if the strikes are good', async () => {
    // @ts-ignore
    network.get.mockReturnValue(mockResponse1)
    const result = await evaluateTicker('TSLA', 5, '2022-06-03')
    expect(result).toEqual({ valid: true })
  })
})
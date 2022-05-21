import * as network from './network'
import { getPrices } from './getPrices'

describe('getPrices', () => {
  beforeEach(() => {
    // @ts-ignore
    network.get = jest.fn()
  })
  
  it('Returns empty array if given empty array', async () => {
    const prices = await getPrices([])
    expect(prices).toEqual([])
  })

  it('Builds the correct URL', async () => {
    // @ts-ignore
    network.get.mockReturnValue({
      quotes: {
        quote: {
          symbol: 'AAPL',
          last: 175,
        }
      }
    })
    await getPrices([ 'AAPL', 'FAKE' ])
    expect(network.get).toHaveBeenCalledWith('markets/quotes?symbols=AAPL,FAKE')
  })

  it('Gets a list of prices for single', async () => {
    // @ts-ignore
    network.get.mockReturnValue({
      quotes: {
        quote: {
          symbol: 'AAPL',
          last: 175,
        }
      }
    })
    const prices = await getPrices([ 'AAPL' ])
    expect(prices).toEqual([
      {
        symbol: 'AAPL',
        price: 175
      }
    ])
  })

  it('Gets a list of prices for multiple', async () => {
    // @ts-ignore
    network.get.mockReturnValue({
      quotes: {
        quote: [
          {
            symbol: 'AAPL',
            last: 175,
          },
          {
            symbol: 'TSLA',
            last: 178,
          },
        ]
      }
    })
    const prices = await getPrices([ 'AAPL', 'TSLA' ])
    expect(prices).toEqual([
      {
        symbol: 'AAPL',
        price: 175
      },
      {
        symbol: 'TSLA',
        price: 178
      }
    ])
  })
})
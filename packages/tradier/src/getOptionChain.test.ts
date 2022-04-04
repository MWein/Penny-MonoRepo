import * as network from './network'
import { getOptionChain } from './getOptionChain'


describe('getOptionChain', () => {
  beforeEach(() => {
    // @ts-ignore
    network.get = jest.fn()
  })

  it('Creates the correct URL', async () => {
    process.env.ACCOUNTNUM = 'somethingsomthing'
    // @ts-ignore
    network.get.mockReturnValue({
      options: 'null'
    })
    await getOptionChain('AAPL', '2021-01-01')
    expect(network.get).toHaveBeenCalledWith('markets/options/chains?symbol=AAPL&expiration=2021-01-01&greeks=true')
  })

  it('Returns empty array if Tradier returns null', async () => {
    // @ts-ignore
    network.get.mockReturnValue({
      options: 'null'
    })
    const gainloss = await getOptionChain('AAPL', '2021-01-01')
    expect(gainloss).toEqual([])
  })

  it('Returns nothing if greeks isnt on the link', async () => {
    const response = {
      options: {
        option: {
          symbol: 'AAPL123C321',
          root_symbol: 'AAPL',
          strike: 120,
          bid: 0.5,
          option_type: 'call',
          expiration_date: '2021-01-01',
        }
      }
    }
    // @ts-ignore
    network.get.mockReturnValue(response)

    const gainloss = await getOptionChain('AAPL', '2021-01-01')
    expect(gainloss).toEqual([])
  })

  it('Returns list of option links, single object', async () => {
    const response = {
      options: {
        option: {
          symbol: 'AAPL123C321',
          root_symbol: 'AAPL',
          strike: 120,
          bid: 0.5,
          option_type: 'call',
          expiration_date: '2021-01-01',
          greeks: {
            delta: 0.17,
          }
        }
      }
    }
    // @ts-ignore
    network.get.mockReturnValue(response)

    const gainloss = await getOptionChain('AAPL', '2021-01-01')
    expect(gainloss).toEqual([
      {
        underlying: 'AAPL',
        symbol: 'AAPL123C321',
        strike: 120,
        premium: 50,
        type: 'call',
        expiration: '2021-01-01',
        delta: 0.17,
      }
    ])
  })

  it('Returns list of option links, multiple objects', async () => {
    const response = {
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
              delta: 0.17,
            }
          },
          {
            symbol: 'AAPL321C321',
            root_symbol: 'AAPL',
            strike: 121,
            bid: 0.7,
            option_type: 'put',
            expiration_date: '2021-02-01',
            greeks: {
              delta: 0.18,
            }
          }
        ],
      }
    }
    // @ts-ignore
    network.get.mockReturnValue(response)

    const gainloss = await getOptionChain('AAPL', '2021-01-01')
    expect(gainloss).toEqual([
      {
        underlying: 'AAPL',
        symbol: 'AAPL123C321',
        strike: 120,
        premium: 50,
        type: 'call',
        expiration: '2021-01-01',
        delta: 0.17,
      },
      {
        underlying: 'AAPL',
        symbol: 'AAPL321C321',
        strike: 121,
        premium: 70,
        type: 'put',
        expiration: '2021-02-01',
        delta: 0.18,
      },
    ])
  })
})
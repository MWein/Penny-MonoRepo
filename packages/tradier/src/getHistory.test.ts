import * as network from './network'
import { getHistory } from './getHistory'

describe('getHistory', () => {
  beforeEach(() => {
    // @ts-ignore
    network.get = jest.fn()
  })

  it('Creates the correct URL', async () => {
    process.env.ACCOUNTNUM = 'somethingsomthing'
    // @ts-ignore
    network.get.mockReturnValue({
      history: 'null'
    })
    await getHistory('AAPL', '2022-01-01', '2022-01-02')
    expect(network.get).toHaveBeenCalledWith('markets/history?symbol=AAPL&interval=daily&start=2022-01-01&end=2022-01-02')
  })

  it('Returns empty array if Tradier returns null', async () => {
    // @ts-ignore
    network.get.mockReturnValue({
      history: 'null'
    })
    const history = await getHistory('AAPL', '2022-01-01', '2022-01-02')
    expect(history).toEqual([])
  })

  it('Returns list of TimeSeries objects, single object', async () => {
    const day = {
      date: '2022-01-01',
      open: 42,
      high: 53,
      low: 41,
      close: 43,
      volume: 102345,
    }

    const response = {
      history: { day }
    }
    // @ts-ignore
    network.get.mockReturnValue(response)

    const history = await getHistory('AAPL', '2021-01-01', '2022-01-01')
    expect(history).toEqual([ day ])
  })

  it('Returns list of option links, multiple objects', async () => {
    const day1 = {
      date: '2022-01-01',
      open: 42,
      high: 53,
      low: 41,
      close: 43,
      volume: 102345,
    }
    const day2 = {
      date: '2022-01-02',
      open: 43,
      high: 54,
      low: 42,
      close: 44,
      volume: 102346,
    }

    const response = {
      history: {
        day: [ day1, day2 ],
      }
    }
    // @ts-ignore
    network.get.mockReturnValue(response)

    const history = await getHistory('AAPL', '2022-01-01', '2022-01-02')
    expect(history).toEqual([ day1, day2 ])
  })
})
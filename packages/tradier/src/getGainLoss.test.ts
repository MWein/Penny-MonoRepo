import * as network from './network'
import {
  getGainLoss
} from './getGainLoss'


describe('getGainLoss', () => {
  beforeEach(() => {
    // @ts-ignore
    network.get = jest.fn()
  })

  it('Creates the URL using defaults', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-10-12').getTime())
    process.env.ACCOUNTNUM = 'somethingsomthing'
    // @ts-ignore
    network.get.mockReturnValue({
      gainloss: 'null'
    })
    await getGainLoss()
    expect(network.get).toHaveBeenCalledWith('accounts/somethingsomthing/gainloss?page=1&limit=1000&start=2020-01-01&end=2021-10-12')
    jest.useRealTimers()
  })

  it('Creates the URL using params', async () => {
    process.env.ACCOUNTNUM = 'somethingsomthing'
    // @ts-ignore
    network.get.mockReturnValue({
      gainloss: 'null'
    })
    await getGainLoss(3, 1200, '2021-02-03', '2022-02-02')
    expect(network.get).toHaveBeenCalledWith('accounts/somethingsomthing/gainloss?page=3&limit=1200&start=2021-02-03&end=2022-02-02')
  })

  it('Returns empty array if Tradier returns null', async () => {
    // @ts-ignore
    network.get.mockReturnValue({
      gainloss: 'null'
    })
    const gainloss = await getGainLoss()
    expect(gainloss).toEqual([])
  })

  it('Returns list of gainLoss objects, single object', async () => {
    const response = {
      gainloss: {
        closed_position: { hello: 'someposition' }
      }
    }
    // @ts-ignore
    network.get.mockReturnValue(response)

    const gainloss = await getGainLoss()
    expect(gainloss).toEqual([ response.gainloss.closed_position ])
  })

  it('Returns list of gainloss objects, multiple objects', async () => {
    const response = {
      gainloss: {
        closed_position: [
          { hello: 'someposition' },
          { hello: 'someotherposition' }
        ]
      }
    }
    // @ts-ignore
    network.get.mockReturnValue(response)

    const gainloss = await getGainLoss()
    expect(gainloss).toEqual(response.gainloss.closed_position)
  })
})
import * as network from './network'
import {
  getGainLoss
} from './getGainLoss'


describe('getGainLoss', () => {
  beforeEach(() => {
    // @ts-ignore
    network.get = jest.fn()
  })

  it('Creates the URL using the account number env; page number is 1 if not provided', async () => {
    process.env.ACCOUNTNUM = 'somethingsomthing'
    // @ts-ignore
    network.get.mockReturnValue({
      gainloss: 'null'
    })
    await getGainLoss()
    expect(network.get).toHaveBeenCalledWith('accounts/somethingsomthing/gainloss?page=1&limit=1000')
  })

  it('Creates the URL using the account number env and page number if provided', async () => {
    process.env.ACCOUNTNUM = 'somethingsomthing'
    // @ts-ignore
    network.get.mockReturnValue({
      gainloss: 'null'
    })
    await getGainLoss(3)
    expect(network.get).toHaveBeenCalledWith('accounts/somethingsomthing/gainloss?page=3&limit=1000')
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
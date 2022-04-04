import { getBalances } from './getBalances'
import * as network from './network'


describe('getBalances', () => {
  beforeEach(() => {
    // @ts-ignore
    network.get = jest.fn()
  })

  it('Returns balances', async () => {
    const mockBalances = {
      balances: {
        some: 'balanceinfo'
      }
    }
    // @ts-ignore
    network.get.mockReturnValue(mockBalances)
    const result = await getBalances()
    expect(result).toEqual(mockBalances.balances)
  })
})
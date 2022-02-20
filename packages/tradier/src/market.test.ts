import * as network from './network'
import { isMarketOpen } from './market'

describe('isMarketOpen', () => {
  beforeEach(() => {
    // @ts-ignore
    network.get = jest.fn()
  })

  it('Returns false if error is thrown', async () => {
    // @ts-ignore
    network.get.mockImplementation(() => {
      throw new Error('NOOOOOOO')
    })
    const result = await isMarketOpen()
    expect(result).toEqual(false)
  })

  it('Returns false if response.state is not \'open\'', async () => {
    // @ts-ignore
    network.get.mockReturnValue({
      clock: {
        state: 'postmarket',
      }
    })
    const result = await isMarketOpen()
    expect(result).toEqual(false)
  })

  it('Returns true if response.state is \'open\'', async () => {
    // @ts-ignore
    network.get.mockReturnValue({
      clock: {
        state: 'open',
      }
    })
    const result = await isMarketOpen()
    expect(result).toEqual(true)
  })
})
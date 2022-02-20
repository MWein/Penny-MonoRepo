import * as network from './network'

export const isMarketOpen = async () : Promise<boolean> => {
  try {
    const response = await network.get('/markets/clock')
    return response.clock.state === 'open'
  } catch (e) {
    return false
  }
}
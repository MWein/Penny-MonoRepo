import * as network from './network'


export type GainLossDetails = {
  symbol: string,
  cost: number,
  quantity: number,
  gain_loss: number,
  open_date: string,
  close_date: string,
  proceeds: number,
}


export const getGainLoss = async (
  pageNum: number = 1,
  limit: number = 1000,
  start: string = '2020-01-01',
  end: string = new Date().toISOString().split('T')[0],
) : Promise<GainLossDetails[]> => {
  const url = `accounts/${process.env.ACCOUNTNUM}/gainloss?page=${pageNum}&limit=${limit}&start=${start}&end=${end}`
  const response = await network.get(url)
  if (response.gainloss === 'null') {
    return []
  }
  if (Array.isArray(response.gainloss.closed_position)) {
    return response.gainloss.closed_position
  } else {
    return [ response.gainloss.closed_position ]
  }
}

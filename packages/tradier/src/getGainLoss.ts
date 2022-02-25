import * as network from './network'


export type GainLossDetails = {
  symbol: string,
  cost: number,
  quantity: number,
  gain_loss: number,
  open_date: string,
  close_date: string,
}


export const getGainLoss = async (pageNum: number = 1) : Promise<GainLossDetails[]> => {
  const url = `accounts/${process.env.ACCOUNTNUM}/gainloss?page=${pageNum}&limit=1000`
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

import { callTradierHelper } from './callTradierHelper'

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
  return callTradierHelper(url, 'gainloss', 'closed_position', true)
}

import * as network from './network'

// TODO Fill this out
export type Balances = {
  total_equity: number
}

export const getBalances = async () : Promise<Balances> => {
  const url = `accounts/${process.env.ACCOUNTNUM}/balances`
  const response = await network.get(url)
  return response.balances
}

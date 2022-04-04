import { callTradierHelper } from './callTradierHelper'

// TODO Fill this out
export type Balances = {
  total_equity: number
}

export const getBalances = async () : Promise<Balances> =>
  callTradierHelper(`accounts/${process.env.ACCOUNTNUM}/balances`, 'balances', null, false)

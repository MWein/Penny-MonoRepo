import { callTradierHelper } from './callTradierHelper'

type TradierChainLink = {
  symbol: string,
  root_symbol: string,
  strike: number,
  bid: number,
  option_type: 'put' | 'call',
  expiration_date: string,
  greeks: {
    delta: number,
  }
}

export type OptionChainLink = {
  symbol: string,
  underlying: string,
  type: 'put' | 'call'
  strike: number,
  premium: number,
  expiration: string,
  delta: number
}


export const formatChain = (chain: TradierChainLink[]) : OptionChainLink[] => chain.filter(option => option.greeks)
  .map(option => ({
    symbol: option.symbol,
    underlying: option.root_symbol,
    type: option.option_type,
    strike: option.strike,
    premium: Number((option.bid * 100).toFixed()),
    expiration: option.expiration_date,
    delta: Math.abs(option.greeks.delta)
  }))


export const getOptionChain = async (symbol: string, expiration: string) : Promise<OptionChainLink[]> => {
  const url = `markets/options/chains?symbol=${symbol}&expiration=${expiration}&greeks=true`
  const response = await callTradierHelper(url, 'options', 'option', true)
  return formatChain(response) as unknown as OptionChainLink[]
}

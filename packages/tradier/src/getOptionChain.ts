import * as network from './network'

type ChainLink = {
  symbol: string,
  strike: number,
  option_type: 'put' | 'call',
  greeks: {
    delta: number,
  }
}

export const getOptionChain = async (symbol: string, expiration: string) : Promise<ChainLink[]> => {
  const url = `markets/options/chains?symbol=${symbol}&expiration=${expiration}&greeks=true`
  const response = await network.get(url)
  if (response.options === 'null') {
    return []
  }
  if (Array.isArray(response.options.option)) {
    return []
  } else {
    return [ response.options.option ]
  }
}

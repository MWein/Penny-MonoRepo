import * as tradier from '@penny/tradier'
import { OptionChainLink, MultilegOptionLeg } from '@penny/tradier'



type ChainLinkWithDeltaDist = OptionChainLink & {
  distanceToDeltaTarget: number,
}


const _insertDistanceToTargetDelta = (chain: OptionChainLink[], targetDelta: number) : ChainLinkWithDeltaDist[] =>
  chain.map(link => ({
    ...link,
    distanceToDeltaTarget: Math.abs(targetDelta - link.delta)
  }))


const _selectLinkClosestToTarget = (chain: ChainLinkWithDeltaDist[]): ChainLinkWithDeltaDist =>
  chain.reduce((acc, link) => link.distanceToDeltaTarget < acc.distanceToDeltaTarget ? link : acc, chain[0])



export const sellSpread = async (chain: OptionChainLink[], symbol: string, type: 'call' | 'put', shortDelta: number, targetStrikeWidth: number): Promise<void> => {
  const typeChain = chain.filter(x => x.type === type)
  const typeChainWithDist = _insertDistanceToTargetDelta(typeChain, shortDelta)
  const shortLink = _selectLinkClosestToTarget(typeChainWithDist)

  // Different filter params depending on the type
  const filterFunc = type === 'put' ?
    (link: OptionChainLink) => (shortLink.strike - link.strike) <= targetStrikeWidth && link.strike < shortLink.strike
    : (link: OptionChainLink) => (link.strike - shortLink.strike) <= targetStrikeWidth && link.strike > shortLink.strike

  // After non-candidates for long is filtered out, this will modify the array (or not)
  // The selection will be the strike with the largest distance from the short strike
  // For calls, the chain has to be reversed to make the selection
  const modifier = type === 'put' ?
    (chain: OptionChainLink[]) => chain :
    (chain: OptionChainLink[]) => chain.reverse()

  const longLinkOptions = modifier(typeChainWithDist.filter(filterFunc))

  if (longLinkOptions.length === 0) {
    return
  }

  const longLink = longLinkOptions[0]

  const legs: MultilegOptionLeg[] = [
    {
      symbol: shortLink.symbol,
      side: 'sell_to_open',
      quantity: 1
    },
    {
      symbol: longLink.symbol,
      side: 'buy_to_open',
      quantity: 1
    }
  ]

  // SELL SELL SELL
  await tradier.multilegOptionOrder(symbol, 'credit', legs)
}




export const sellIronCondor = async (symbol: string, shortDelta: number, targetStrikeWidth: number) => {
  const expiratons = await tradier.getExpirations(symbol)
  if (!expiratons || expiratons.length === 0) {
    return
  }
  const expiration = expiratons[0]
  const chain = await tradier.getOptionChain(symbol, expiration)

  await sellSpread(chain, symbol, 'put', shortDelta, targetStrikeWidth)
  await sellSpread(chain, symbol, 'call', shortDelta, targetStrikeWidth)
}




// SPY, IWM, QQQ version

export const sellIronCondorBigThree = async () => {
  const bigThree = [ 'SPY', 'IWM', 'QQQ' ]

  // Is bigThree enabled?

  // Is market open

  // Get big three settings (individual)
    // Enabled?
    // Short delta
    // maxStrikeWidth

  for (let x = 0; x < bigThree.length; x++) {
    console.log(bigThree[x])
    await sellIronCondor(bigThree[x], 0.1, 1)
  }
}


export const sellIronCondors = async () => {
  // Is iron condor enabled?

  // Is market open?

  // TODO get stocks from DB
  const symbols = []

  // TODO Filter for enabled
    // Map out just symbols

  // TODO Filter out ones where positions already exist

  for (let x = 0; x < symbols.length; x++) {
    console.log(symbols[x])
    await sellIronCondor(symbols[x], 0.1, 1)
  }

}
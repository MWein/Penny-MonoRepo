import * as tradier from '@penny/tradier'



type ChainLinkWithDistToTarget = OptionChainLink & {
  distanceToTarget: number,
}


const insertDistanceToTargetDelta = (chain, targetDelta) => {

}



export const sellIronCondor = async (symbol: string, shortDelta: number, maxStrikeWidth: number) => {
  const expiratons = await tradier.getExpirations(symbol)
  if (!expiratons || expiratons.length === 0) {
    return
  }
  const expiration = expiratons[0]

  const chain = await tradier.getOptionChain(symbol, expiration)

  // Select strikes for put side



  // Select strikes for call side

  // Send order
}




// SPY, IWM, QQQ version

export const sellIronCondorBigThree = async () => {
  const bigThree = [ 'SPY' ]

  // Is bigThree enabled?

  // Is market open

  // Get big three settings (individual)
    // Enabled?
    // Short delta
    // maxStrikeWidth

  // For each
    // If enabled, continue
    // Run sellIronCondor func
}
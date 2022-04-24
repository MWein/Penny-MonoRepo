import * as tradier from "@penny/tradier"


const pickRandomTickersHelper = async (
  candidates: string[],
  sellPerDay: number,
  maxStrikeWidth: number,
  expiration: string,
  selectedTickers: string[]
): Promise<string[]> => {
  if (candidates.length === 0) {
    return selectedTickers
  }

  const index = Math.floor(Math.random() * candidates.length)
  const candidate = candidates[index]

  const evaluation = await tradier.evaluateTicker(candidate, maxStrikeWidth, expiration)
  const newCandidates = candidates.filter(x => x !== candidate)

  if (evaluation.valid) {
    const newSelectedTickers = [ ...selectedTickers, candidate ]
    if (newSelectedTickers.length === sellPerDay) {
      return newSelectedTickers
    }
    return pickRandomTickersHelper(newCandidates, sellPerDay, maxStrikeWidth, expiration, newSelectedTickers)
  }

  return pickRandomTickersHelper(newCandidates, sellPerDay, maxStrikeWidth, expiration, selectedTickers)  
}


export const pickRandomTickers = async (
  tickers: string[],
  sellPerDay: number,
  maxStrikeWidth: number,
  expiration: string
): Promise<string[]> => {
  return pickRandomTickersHelper(tickers, sellPerDay, maxStrikeWidth, expiration, [])
}
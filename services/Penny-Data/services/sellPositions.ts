import * as tradier from '@penny/tradier'
import { Position } from '@penny/tradier'
import { chunk } from 'lodash'
import { getUnderlying } from '@penny/option-symbol-parser'

export const sellPositions = async (positions: Position[]): Promise<void> => {
  const chunks = chunk(positions)
  for (let x = 0; x < chunks.length; x++) {
    const chunk: Position[] = chunks[x]
    await Promise.all(chunk.map(async pos => {
      await tradier.sellToClose(getUnderlying(pos.symbol), pos.symbol, pos.quantity)
    }))
  }
}
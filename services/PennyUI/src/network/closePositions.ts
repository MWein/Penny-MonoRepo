import { Position } from '../common/types'
import getPennyDataUrl from "./getPennyDataUrl"
const superagent = require('superagent')

export const closePositions = async (positions: Position[]) => {
  const basePath = getPennyDataUrl()

  const result = await superagent.post(`${basePath}/sell-positions`)
    .send(positions)
    .timeout({
      deadline: 5000
    }).retry(5)
  
  return result.text
}
import getPennyDataUrl from "./getPennyDataUrl"
import { AccountInfoPanelProps } from '../components/AccountInfoPanel'
import { PositionChitsControllerProps } from '../controllers/PositionChitsController'
const superagent = require('superagent')

export type ShowcaseProps = AccountInfoPanelProps & PositionChitsControllerProps

export const defaultShowcaseProps: ShowcaseProps = {
  equity: 0,
  weekEarnings: 0,
  weekPercReturn: 0,
  monthEarnings: 0,
  monthPercReturn: 0,
  yearEarnings: 0,
  yearPercReturn: 0,
  theft: 0,
  lastYearTheft: 0,
  positions: [],
}


const fetchShowcaseData = async (
  setLoading: Function,
  setShowcaseProps: Function,
) => {
  const basePath = getPennyDataUrl()

  setLoading(true)
  const result = await superagent.get(`${basePath}/showcase`).timeout({
    deadline: 20000
  }).retry(5).catch(() => {
    setLoading(false)
    setShowcaseProps(defaultShowcaseProps)
  })

  if (result.body) {
    setLoading(false)
    setShowcaseProps(result.body)
  }
}

export default fetchShowcaseData
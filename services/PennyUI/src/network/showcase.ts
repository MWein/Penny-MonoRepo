import getPennyDataUrl from "./getPennyDataUrl"
import { AccountInfoPanelProps } from '../components/AccountInfoPanel'
import { PositionChitsControllerProps } from '../controllers/PositionChitsController'
const superagent = require('superagent')

export type ShowcaseProps = AccountInfoPanelProps & PositionChitsControllerProps

export const defaultShowcaseProps: ShowcaseProps = {
  equity: 0,
  weekEarnings: 0,
  currentValueLong: 0,
  currentValueShort: 0,
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
  setEquity: Function,
  setWeekEarnings: Function,
  setWeekPercReturn: Function,
  setMonthEarnings: Function,
  setMonthPercReturn: Function,
  setYearEarnings: Function,
  setYearPercReturn: Function,
  setTheft: Function,
  setLastYearTheft: Function,
  setPositions: Function,
  setCurrentValueLong: Function,
  setCurrentValueShort: Function,
) => {
  const basePath = getPennyDataUrl()

  setLoading(true)
  const result = await superagent.get(`${basePath}/showcase`).timeout({
    deadline: 20000
  }).retry(5).catch(() => {
    setLoading(false)

    setEquity(0)
    setWeekEarnings(0)
    setMonthEarnings(0)
    setYearEarnings(0)
    setTheft(0)
    setLastYearTheft(0)
    setPositions([])
    setCurrentValueLong(0)
    setCurrentValueShort(0)
  })

  if (result.body) {
    setLoading(false)

    setEquity(result.body.equity)
    setWeekEarnings(result.body.weekEarnings)
    setWeekPercReturn(result.body.weekPercReturn)
    setMonthEarnings(result.body.monthEarnings)
    setMonthPercReturn(result.body.monthPercReturn)
    setYearEarnings(result.body.yearEarnings)
    setYearPercReturn(result.body.yearPercReturn)
    setTheft(result.body.theft)
    setLastYearTheft(result.body.lastYearTheft)
    setPositions(result.body.positions)
    setCurrentValueLong(result.body.currentValueLong)
    setCurrentValueShort(result.body.currentValueShort)
  }
}

export default fetchShowcaseData
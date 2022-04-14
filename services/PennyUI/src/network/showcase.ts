import getPennyDataUrl from "./getPennyDataUrl"
const superagent = require('superagent')

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
  }
}

export default fetchShowcaseData
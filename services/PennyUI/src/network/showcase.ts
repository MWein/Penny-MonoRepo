const superagent = require('superagent')

// TODO CHANGE URL
const fetchShowcaseData = async (
  setLoading: Function,
  setEquity: Function,
  setWeekEarnings: Function,
  setMonthEarnings: Function,
  setYearEarnings: Function,
  setTheft: Function,
  setLastYearTheft: Function,
  setPositions: Function,
) => {
  setLoading(true)
  const result = await superagent.get(`http://localhost:3001/showcase`).timeout({
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
    setMonthEarnings(result.body.monthEarnings)
    setYearEarnings(result.body.yearEarnings)
    setTheft(result.body.theft)
    setLastYearTheft(result.body.lastYearTheft)
    setPositions(result.body.positions)
  }
}

export default fetchShowcaseData
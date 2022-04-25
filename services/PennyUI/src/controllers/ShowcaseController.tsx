import { useEffect, useState } from 'react'
import { PositionChitProps } from '../components/PositionChit'
import Showcase from '../components/Showcase'
import { fetchPennyStatus, fetchPennyCronTimes } from '../network/checkPenny'
import fetchShowcaseData, { ShowcaseProps, defaultShowcaseProps } from '../network/showcase'
import { CronTime } from '../components/CronTimesPanel'


// ****************** MOCK DATA *********************

// const generateMockPosition = (
//   ticker: string,
//   side: 'long' | 'short',
//   gainLoss: number,
//   maxLoss: number,
//   maxGain: number,
//   hasPut: boolean,
//   hasCall: boolean,
// ) => ({
//   ticker,
//   side,
//   gainLoss,
//   maxLoss,
//   maxGain,
//   hasPut,
//   hasCall,
// })

// const randomMockPosition = (ticker: string) => {
//   const side = Math.random().toFixed(0) === '1' ? 'short' : 'long'
//   const hasPut = Math.random().toFixed(0) === '1'
//   const hasCall = hasPut ? Math.random().toFixed(0) === '1' : true

//   let maxLoss = 0
//   if (hasPut) {
//     maxLoss += Number(((15 + (Math.random() * 10)) * -1).toFixed(0))
//   }
//   if (hasCall) {
//     maxLoss += Number(((15 + (Math.random() * 10)) * -1).toFixed(0))
//   }

//   const maxGain = 100 + maxLoss
//   const gainLoss = Number((maxLoss + (Math.random() * 100)).toFixed(0))

//   return generateMockPosition(ticker, side, gainLoss, maxLoss, maxGain, hasPut, hasCall)
// }

// const symbols = [
//   'DIA', 'AAPL', 'TSLA', 'MSFT', 'BAC', 'WFC', 'FB', 'PTON', 'AMC', 'F',
//   'SNDL', 'AMZN', 'DIS', 'NIO', 'LCID', 'NFLX', 'PFE', 'NVDA', 'AAL', 'SNAP', 'PLUG', 'HOOD',
//   'GPRO', 'BABA', 'CCL', 'ACB', 'NOK', 'DAL', 'UAL', 'PLTR', 'GME', 'SBUX', 'AMD',
//   'COIN', 'TLRY', 'TWTR', 'RIVN', 'T', 'KO', 'CGC', 'GOOG', 'MRNA', 'SPCE', 'BB', 'PYPL', 'UBER',
//   'GM', 'ZNGA', 'NCLH', 'WKHS', 'SQ', 'DKNG', 'ABNB', 'BA', 'WMT',
//   'JNJ', 'CHPT', 'LUV', 'MRO', 'ARKK', 'RIOT', 'XOM', 'SOFI', 'WISH', 'SONY',
//   'PENN', 'COST', 'ZM', 'JPM',
//   'RCL', 'CLOV', 'ET', 'INTC', 'V', 'TSM', 'FUBO', 'MA',
//   'XLB', 'XLC', 'XLE', 'XLF', 'XLI', 'XLK', 'XLP', 'XLU', 'XLV', 'XLY',

//   'SPY', 'IWM', 'QQQ',

//   // Leveraged
//   'TQQQ', 'SOXL', 'DUST', 'ERX', 'FAS', 'FAZ', 'JNUG', 'LABD', 'LABU', 'NUGT', 'SDS', 'TNA', 'UPRO', 'YINN'
// ]

// const mockPositions = symbols.map(symbol => randomMockPosition(symbol))

// mockPositions.push(generateMockPosition('FAKE', 'short', 40000, -20, 35, true, true))
// mockPositions.push(generateMockPosition('FAKE2', 'long', -50000, -20, 50, true, true))

//const mockEquity = 20000 + (Math.random() * 40000)
//const mockMonthEarnings = -500 + (Math.random() * 1000)
//const mockYearEarnings = Math.random() * 30000
//const mockTheft = mockYearEarnings * .22
//const mockLastYearTheft = (Math.random() * 30000) * .22

// ****************** MOCK DATA *********************


const ShowcaseController = () => {
  const [ loading, setLoading ] = useState<boolean>(false)

  const [ checkingPenny, setCheckingPenny ] = useState<boolean>(false)
  const [ checkingCrons, setCheckingCrons ] = useState<boolean>(true)
  const [ pennyHealthy, setPennyHealthy ] = useState<boolean>(false)
  const [ crons, setCrons ] = useState<CronTime[]>([])

  const [ showcaseProps, setShowcaseProps ] = useState<ShowcaseProps>(defaultShowcaseProps)

  const [ equity, setEquity ] = useState<number>(0)
  const [ weekEarnings, setWeekEarnings ] = useState<number>(0)
  const [ weekPercReturn, setWeekPercReturn ] = useState<number>(0)

  const [ currentValueLong, setCurrentValueLong ] = useState<number>(0)
  const [ currentValueShort, setCurrentValueShort ] = useState<number>(0)

  const [ monthEarnings, setMonthEarnings ] = useState<number>(0)
  const [ monthPercReturn, setMonthPercReturn ] = useState<number>(0)

  const [ yearEarnings, setYearEarnings ] = useState<number>(0)
  const [ yearPercReturn, setYearPercReturn ] = useState<number>(0)

  const [ theft, setTheft ] = useState<number>(0)
  const [ lastYearTheft, setLastYearTheft ] = useState<number>(0)
  const [ positions, setPositions ] = useState<PositionChitProps[]>([])

  // Refresh every 15 minutes
  // TODO Replace with useReducer
  useEffect(() => {
    const fetchShorthand = () => fetchShowcaseData(
      setLoading,
      setEquity,
      setWeekEarnings,
      setWeekPercReturn,
      setMonthEarnings,
      setMonthPercReturn,
      setYearEarnings,
      setYearPercReturn,
      setTheft,
      setLastYearTheft,
      setPositions,
      setCurrentValueLong,
      setCurrentValueShort,
    )
    fetchShorthand()
    const intervalId = setInterval(() => {
      fetchShorthand()
    }, 60000 * 15)
    return () => clearInterval(intervalId)
  }, [])


  // Check penny status every minute
  useEffect(() => {
    fetchPennyStatus(setCheckingPenny, setPennyHealthy)
    fetchPennyCronTimes(setCheckingCrons, setCrons)
    const intervalId = setInterval(() => {
      fetchPennyStatus(setCheckingPenny, setPennyHealthy)
      fetchPennyCronTimes(setCheckingCrons, setCrons)
    }, 60000)
    return () => clearInterval(intervalId)
  }, [])


  return (
    <Showcase
      loading={loading}
      checkingPenny={checkingPenny}
      checkingCrons={checkingCrons}
      pennyHealthy={pennyHealthy}
      crons={crons}
      equity={equity}
      weekEarnings={weekEarnings}
      currentValueLong={currentValueLong}
      currentValueShort={currentValueShort}
      weekPercReturn={weekPercReturn}
      monthEarnings={monthEarnings}
      monthPercReturn={monthPercReturn}
      yearEarnings={yearEarnings}
      yearPercReturn={yearPercReturn}
      theft={theft}
      lastYearTheft={lastYearTheft}
      positions={positions}
    />
  )
}

export default ShowcaseController
import { useEffect, useState } from 'react'
import ShowcaseRNS from '../components/ShowcaseRNS'
import { fetchPennyStatus, fetchPennyCronTimes } from '../network/checkPenny'
import fetchShowcaseData, { ShowcaseProps, defaultShowcaseProps } from '../network/showcaseRNS'
import { CronTime } from '../components/CronTimesPanel'

// ****************** MOCK DATA *********************

// const generateSymbol = (
//   symbol: string,
//   type: 'call' | 'put' | 'stock',
//   customExp: string | null = null,
//   customStrike: number | null = null
// ) => {
//   const expText = customExp ? customExp.replace(/-/g, '').slice(2) : '1234'

//   let strikeText = '3214'
//   if (customStrike) {
//     const beforeDecimalDigits = `${customStrike}`.split('.')[0].split('')
//     const afterDecimalDigits = `${customStrike}`.split('.')[1]?.split('') || []

//     while (beforeDecimalDigits.length !== 5) {
//       beforeDecimalDigits.unshift('0')
//     }

//     while (afterDecimalDigits.length !== 3) {
//       afterDecimalDigits.push('0')
//     }

//     strikeText = beforeDecimalDigits.join('') + afterDecimalDigits.join('')
//   }

//   switch (type) {
//   case 'stock':
//     return symbol
//   case 'call':
//     return `${symbol}${expText}C${strikeText}`
//   case 'put':
//     return `${symbol}${expText}P${strikeText}`
//   }
// }

// const generateMockPosition = (
//   id: number,
//   symbol: string,
//   quantity: number,
//   cost_basis: number,
//   date_acquired: string,
//   gainLoss: number,
// ) => ({
//   id,
//   symbol,
//   quantity,
//   cost_basis,
//   date_acquired,
//   gainLoss,
// })

// const randomMockPosition = (ticker: string, index: number) => {
//   const typeRand = Number((Math.random() * 2).toFixed(0))
//   let type: 'call' | 'put' | 'stock' = 'stock'
//   if (typeRand === 0) type = 'call'
//   else if (typeRand === 1) type = 'put'
//   else if (typeRand === 2) type = 'stock'

//   let quantity = Number(((Math.random() * 2) + 1).toFixed(0))
//   if (type === 'stock') {
//     quantity = Number(((Math.random() * 200) + 1).toFixed(0))
//   }

//   let dayAcquired = Number(((Math.random() * 3) + 17).toFixed(0))

//   const gainLoss = Number(((Math.random() * 2000) - 1000).toFixed(2))
//   const costBasis = Number((Math.random() * 500).toFixed(0))

//   //const type = Math.random().toFixed(0) === '1' ? 'call' : 'put'
//   const symbol = generateSymbol(ticker, type, '2022-05-20', 69)

//   return generateMockPosition(index, symbol, quantity, costBasis, `2022-05-${dayAcquired}`, gainLoss)
// }

// const symbols = [
//   'DIA', 'AAPL', 'TSLA', 'MSFT', 'BAC', 'WFC', 'FB', 'PTON', 'AMC', 'F',
//   'SNDL', 'AMZN', 'DIS', 'NIO', 'LCID', 'NFLX', 'PFE', 'NVDA', 'AAL', 'SNAP', 'PLUG', 'HOOD',
// ]

// const mockPositions = symbols.map((symbol, index) => randomMockPosition(symbol, index))

// mockPositions.push(generateMockPosition('FAKE', 'short', 40000, -20, 35, true, true))
// mockPositions.push(generateMockPosition('FAKE2', 'long', -50000, -20, 50, true, true))

// const mockEquity = 20000 + (Math.random() * 40000)
// const mockMonthEarnings = -500 + (Math.random() * 1000)
// const mockYearEarnings = Math.random() * 30000
// const mockTheft = mockYearEarnings * .22
// const mockLastYearTheft = (Math.random() * 30000) * .22

// ****************** MOCK DATA *********************


const ShowcaseControllerRNS = () => {
  const [ loading, setLoading ] = useState<boolean>(false)

  const [ checkingPenny, setCheckingPenny ] = useState<boolean>(false)
  const [ checkingCrons, setCheckingCrons ] = useState<boolean>(true)
  const [ pennyHealthy, setPennyHealthy ] = useState<boolean>(false)
  const [ crons, setCrons ] = useState<CronTime[]>([])

  const [ showcaseProps, setShowcaseProps ] = useState<ShowcaseProps>(defaultShowcaseProps)

  // Refresh every 15 minutes
  useEffect(() => {
    const fetchShorthand = () => fetchShowcaseData(
      setLoading,
      setShowcaseProps,
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
    <ShowcaseRNS
      loading={loading}
      checkingPenny={checkingPenny}
      checkingCrons={checkingCrons}
      pennyHealthy={pennyHealthy}
      crons={crons}
      equity={showcaseProps.equity}
      weekEarnings={showcaseProps.weekEarnings}
      monthEarnings={showcaseProps.monthEarnings}
      yearEarnings={showcaseProps.yearEarnings}
      theft={showcaseProps.theft}
      lastYearTheft={showcaseProps.lastYearTheft}
      positions={showcaseProps.positions}
    />
  )
}

export default ShowcaseControllerRNS
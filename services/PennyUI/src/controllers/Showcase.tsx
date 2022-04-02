import { useEffect, useState } from 'react'
import { PositionChitProps } from '../components/PositionChit'
import AccountInfoPanel from '../components/AccountInfoPanel'
import PennyStatus from '../components/PennyStatus'

import PositionChitsController from './PositionChitsController'


// ****************** MOCK DATA *********************

const generateMockPosition = (
  ticker: string,
  gainLoss: number,
  maxLoss: number,
  maxGain: number,
  hasPut: boolean,
  hasCall: boolean,
) => ({
  ticker,
  gainLoss,
  maxLoss,
  maxGain,
  hasPut,
  hasCall,
})

const randomMockPosition = (ticker: string) => {
  const hasPut = Math.random().toFixed(0) === '1'
  const hasCall = hasPut ? Math.random().toFixed(0) === '1' : true

  let maxLoss = 0
  if (hasPut) {
    maxLoss += Number(((15 + (Math.random() * 10)) * -1).toFixed(0))
  }
  if (hasCall) {
    maxLoss += Number(((15 + (Math.random() * 10)) * -1).toFixed(0))
  }

  const maxGain = 100 + maxLoss
  const gainLoss = Number((maxLoss + (Math.random() * 100)).toFixed(0))

  return generateMockPosition(ticker, gainLoss, maxLoss, maxGain, hasPut, hasCall)
}

const symbols = [
  'DIA', 'AAPL', 'TSLA', 'MSFT', 'BAC', 'WFC', 'FB', 'PTON', 'AMC', 'F',
  'SNDL', 'AMZN', 'DIS', 'NIO', 'LCID', 'NFLX', 'PFE', 'NVDA', 'AAL', 'SNAP', 'PLUG', 'HOOD',
  'GPRO', 'BABA', 'CCL', 'ACB', 'NOK', 'DAL', 'UAL', 'PLTR', 'GME', 'SBUX', 'AMD',
  'COIN', 'TLRY', 'TWTR', 'RIVN', 'T', 'KO', 'CGC', 'GOOG', 'MRNA', 'SPCE', 'BB', 'PYPL', 'UBER',
  'GM', 'ZNGA', 'NCLH', 'WKHS', 'SQ', 'DKNG', 'ABNB', 'BA', 'WMT',
  'JNJ', 'CHPT', 'LUV', 'MRO', 'ARKK', 'RIOT', 'XOM', 'SOFI', 'WISH', 'SONY',
  'PENN', 'COST', 'ZM', 'JPM',
  'RCL', 'CLOV', 'ET', 'INTC', 'V', 'TSM', 'FUBO', 'MA',
  'XLB', 'XLC', 'XLE', 'XLF', 'XLI', 'XLK', 'XLP', 'XLU', 'XLV', 'XLY',

  'SPY', 'IWM', 'QQQ',

  // Leveraged
  'TQQQ', 'SOXL', 'DUST', 'ERX', 'FAS', 'FAZ', 'JNUG', 'LABD', 'LABU', 'NUGT', 'SDS', 'TNA', 'UPRO', 'YINN'
]

const mockPositions = symbols.map(symbol => randomMockPosition(symbol))

mockPositions.push(generateMockPosition('FAKE', 40000, -20, 35, true, true))
mockPositions.push(generateMockPosition('FAKE2', -50000, -20, 50, true, true))

const mockEquity = 20000 + (Math.random() * 40000)
const mockMonthEarnings = -500 + (Math.random() * 1000)
const mockYearEarnings = Math.random() * 30000
const mockTheft = mockYearEarnings * .22
const mockLastYearTheft = (Math.random() * 30000) * .22

// ****************** MOCK DATA *********************


type ShowcaseProps = {
  isNonProd: boolean,
}

const Showcase = ({
  isNonProd,
}: ShowcaseProps) => {
  const [ loading, setLoading ] = useState<boolean>(true)

  const [ pennyHealthy, setPennyHeathy ] = useState<boolean>(false)
  const [ equity, setEquity ] = useState<number>(0)
  const [ weekEarnings, setWeekEarnings ] = useState<number>(0)
  const [ monthEarnings, setMonthEarnings ] = useState<number>(0)
  const [ yearEarnings, setYearEarnings ] = useState<number>(0)
  const [ theft, setTheft ] = useState<number>(0)
  const [ lastYearTheft, setLastYearTheft ] = useState<number>(0)
  const [ positions, setPositions ] = useState<PositionChitProps[]>([])

  // TODO Network call

  useEffect(() => {
    

  }, [])


  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ padding: '10px', width: '250px', minWidth: '250px' }}>
          <PennyStatus
            loading={loading}
            healthy={pennyHealthy}
          />
          <div style={{ height: '10px' }} />
          <AccountInfoPanel
              equity={equity}
              weekEarnings={weekEarnings}
              monthEarnings={monthEarnings}
              yearEarnings={yearEarnings}
              theft={theft}
              lastYearTheft={lastYearTheft}
          />
        </div>

        <PositionChitsController positions={positions} />
      </div>
    </>
  )
}

export default Showcase
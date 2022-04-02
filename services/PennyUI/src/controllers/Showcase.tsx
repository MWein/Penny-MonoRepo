import PositionChit from '../components/PositionChit'
import AccountInfoPanel from '../components/AccountInfoPanel'
import PennyStatus from '../components/PennyStatus'
import EnvironmentRibbon from '../components/EnvironmentRibbon'


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

const positions = symbols.map(symbol => randomMockPosition(symbol))

// ****************** MOCK DATA *********************



const Showcase = () => {

  // Do stuff

  return (
    <>
      <EnvironmentRibbon />
      <div style={{ display: 'flex' }}>
        <div style={{ padding: '10px', width: '500px' }}>
          <PennyStatus
            loading={false}
            healthy={true}
          />
          <div style={{ height: '10px' }} />
          <AccountInfoPanel
              equity={94243.1248}
              weekEarnings={12}
              monthEarnings={50}
              yearEarnings={60}
              theft={70}
              lastYearTheft={80}
          />
        </div>

        <div style={{ display: 'inline-block', marginTop: '5px' }}>
          {
            positions.map(pos =>
              <PositionChit ticker={pos.ticker} gainLoss={pos.gainLoss} maxLoss={pos.maxLoss} maxGain={pos.maxGain} hasPut={pos.hasPut} hasCall={pos.hasCall} />
            )
          }
        </div>
      </div>
    </>
  )
}

export default Showcase
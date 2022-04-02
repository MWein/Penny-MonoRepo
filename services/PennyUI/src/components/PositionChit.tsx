import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import './PositionChit.css'


type PositionChitProps = {
  ticker: string,
  gainLoss: number,
  maxLoss: number,
  maxGain: number,
  hasPut?: boolean,
  hasCall?: boolean,
}

const PositionChit = ({
  ticker,
  gainLoss,
  maxLoss,
  maxGain,
  hasPut = false,
  hasCall = false,
}: PositionChitProps) => {
  const callPutText = (active: boolean, text: string) => (
    <Typography style={{ color: active ? 'black' : 'lightGray' }} variant='subtitle2' className='call-put'>
      {text}
    </Typography>
  )

  // Graph position settings
  const graphStartPos = 10
  const graphEndPos = 90
  const maxGainLossHeight = 45

  // Color settings
  const baseGraphColor = 'black'

  const gainLossTickColor = gainLoss > 0 ? 'green' : 'red'

  // Calculated positions
  const zeroPosition = 25
  const gainLossPosition = 55


  return (
    <Paper className='position-chit'>
      <Typography variant='h6' className='horizontal-center'>
        {ticker}
      </Typography>

      <div style={{ flex: 1 }} />

      <svg xmlns="http://www.w3.org/2000/svg" height='50px' width='100px' viewBox="0 0 100 50">
        <g>
          {/* Base Graph */}
          <path d={`M ${graphStartPos} 25 L ${graphEndPos} 25`} stroke={baseGraphColor} />
          <path d={`M ${graphStartPos} 15 L ${graphStartPos} 30`} stroke={baseGraphColor} />
          <path d={`M ${graphEndPos} 15 L ${graphEndPos} 30`} stroke={baseGraphColor} />

          {/* Zero Tick */}
          <path d={`M ${zeroPosition} 20 L ${zeroPosition} 25`} stroke='black' />

          {/* Gain Loss Tick */}
          <path d={`M ${gainLossPosition} 20 L ${gainLossPosition} 25`} stroke={gainLossTickColor} strokeWidth={2} />

          {/* Max Loss */}
          <text text-anchor="middle" x={`${graphStartPos}`} y={`${maxGainLossHeight}`} style={{ fontSize: '12px' }}>{maxLoss}</text>

          {/* Zero */}
          <text text-anchor="middle" x={zeroPosition} y="35" style={{ fontSize: '12px' }}>0</text>

          {/* Max Gain */}
          <text text-anchor="middle" x={`${graphEndPos}`} y={`${maxGainLossHeight}`} style={{ fontSize: '12px' }}>{maxGain}</text>

          {/* Gain Loss */}
          <text text-anchor="middle" x={gainLossPosition} y="15" style={{ fontSize: '12px' }} stroke={gainLossTickColor}>{gainLoss}</text>
        </g>
      </svg>


      <div style={{ width: '10px' }} />

      <div className='horizontal-center'>
        {callPutText(hasCall, 'Call')}
        {callPutText(hasPut, 'Put')}
      </div>
    </Paper>
  )
}

export default PositionChit
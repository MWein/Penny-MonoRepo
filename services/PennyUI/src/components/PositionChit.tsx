import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import PositionChitGraph from './PositionChitGraph'
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

  return (
    <Paper className='position-chit'>
      <Typography variant='h6' className='vertical-center'>
        {ticker}
      </Typography>

      <div style={{ flex: 1 }} />

      <PositionChitGraph
        gainLoss={gainLoss}
        maxGain={maxGain}
        maxLoss={maxLoss}
      />

      <div style={{ width: '5px' }} />

      <div className='vertical-center'>
        {callPutText(hasCall, 'Call')}
        {callPutText(hasPut, 'Put')}
      </div>
    </Paper>
  )
}

export default PositionChit
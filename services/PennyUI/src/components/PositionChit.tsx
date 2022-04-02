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


  return (
    <Paper style={{ padding: '10px', width: '200px', height: '40px', display: 'inline-flex' }}>
      <Typography variant='h6' className='horizontal-center'>
        {ticker}
      </Typography>

      <div style={{ flex: 1 }} />

      <div className='horizontal-center'>
        {callPutText(hasCall, 'Call')}
        {callPutText(hasPut, 'Put')}
      </div>
    </Paper>
  )
}

export default PositionChit
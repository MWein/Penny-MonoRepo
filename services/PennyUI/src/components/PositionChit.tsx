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
  return (
    <Paper style={{ padding: '10px', width: '200px', height: '40px', display: 'inline-flex' }}>
      <Typography variant='h6' className='horizontal-center'>
        {ticker}
      </Typography>

      <div style={{ flex: 1 }} />

      <div className='horizontal-center'>
        <Typography variant='subtitle2' className='call-put'>
          {hasCall ? 'Call' : ' '}
        </Typography>
        <Typography variant='subtitle2' className='call-put'>
          {hasPut ? 'Put' : ' '}
        </Typography>
      </div>
    </Paper>
  )
}

export default PositionChit
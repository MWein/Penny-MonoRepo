import { Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { PositionChitProps } from './PositionChitRNS'
import { moneyFormat } from '../common/formatting'

export type DayChitProps = {
  date: Date,
  positions: PositionChitProps[]
}


const DayChit = ({
  date,
  positions,
}: DayChitProps) => {
  const dayOfWeek = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ][date.getDay()]

  const totalGainLoss = positions.reduce((acc, pos) => acc + pos.gainLoss, 0)
  const gainLossText = moneyFormat(totalGainLoss)
  const costBasisText = moneyFormat(positions.reduce((acc, pos) => acc + pos.cost_basis, 0))

  return (
    <Paper style={{
      flex: 1,
      marginTop: '4px',
      marginBottom: '5px',
      marginRight: '5px',
      marginLeft: '5px',
      padding: '10px',
      display: 'inline-flex'
    }}>
      <div style={{ flex: 1, paddingLeft: '10px' }}>
        <Typography variant='h6' style={{ flex: 1 }}>
          {dayOfWeek}
        </Typography>
        <Typography variant='subtitle2'>
          {date.toISOString().split('T')[0]}
        </Typography>
      </div>
      <div style={{ textAlign: 'right' }}>
        <Typography variant='h6' style={{ color: totalGainLoss > 0 ? 'green' : 'red' }}>
          {gainLossText}
        </Typography>
        <Typography variant='subtitle2'>
          {costBasisText}
        </Typography>
      </div>
    </Paper>
  )
}

export default DayChit
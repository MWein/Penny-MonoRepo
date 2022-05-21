import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { getType, getUnderlying } from '../common/optionSymbolParser'
import { moneyFormat } from '../common/formatting'

export type PositionChitProps = {
  id: number,
  symbol: string
  quantity: number,
  cost_basis: number,
  date_acquired: string,
  gainLoss: number,
}

const PositionChit = ({
  id,
  symbol,
  quantity,
  cost_basis,
  date_acquired,
  gainLoss,
}: PositionChitProps) => {
  const typeMap = {
    put: 'Put',
    call: 'Call',
    neither: 'Share'
  }
  const typeColorMap = {
    put: 'red',
    call: 'green',
    neither: 'black'
  }

  const type = getType(symbol)
  const typeText = `${quantity} ${typeMap[type]}${quantity === 1 ? '' : 's'}`

  const optionData = () => {
    if ([ 'call', 'put' ].includes(type)) {
      return (
        <Typography style={{ textAlign: 'center' }}>
          {date_acquired}
        </Typography>
      )
    }
    return null
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <Paper style={{
        marginTop: '4px',
        marginBottom: '5px',
        marginRight: '5px',
        marginLeft: '5px',
        padding: '10px',
        width: '150px',
      }}>
        <div style={{ display: 'inline-flex', width: '100%' }}>
          <Typography style={{ flex: 1 }}>
            {getUnderlying(symbol)}
          </Typography>
          <Typography style={{ color: typeColorMap[getType(symbol)] }}>
            {typeText}
          </Typography>
        </div>
        <div style={{ height: '5px' }} />
        {optionData()}
        <div>
          <Typography variant='h6' style={{ textAlign: 'center', color: gainLoss > 0 ? 'green' : 'red' }}>
            {moneyFormat(gainLoss)}
          </Typography>
        </div>
      </Paper>
    </div>
  )
}

export default PositionChit
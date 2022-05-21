import Typography from '@mui/material/Typography'
import { getType, isOption } from '../common/optionSymbolParser'
import PositionChitRNS, { PositionChitProps } from '../components/PositionChitRNS'


export type PositionChitsControllerProps = {
  positions: PositionChitProps[],
}

const PositionChitsController = ({
  positions,
}: PositionChitsControllerProps) => {
  if (!positions.length) {
    return (
      <Typography
        variant='h4'
        style={{
          color: 'white',
          marginTop: '10px',
          flex: 1,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        No Positions
      </Typography>
    )
  }

  // Sorts alphabetically
  //const alphabeticallySorted = positions.sort((a, b) => a.symbol.localeCompare(b.symbol))

  const nonOptionPositions = positions.filter(pos => !isOption(pos.symbol))
  const putPositions = positions.filter(pos => getType(pos.symbol) === 'put')
  const callPositions = positions.filter(pos => getType(pos.symbol) === 'call')

  const sortedPositions = [ ...putPositions, ...callPositions ]

  return (
    <div style={{ display: 'inline-block', marginTop: '7px' }}>
      {
        sortedPositions.map(pos =>
          <PositionChitRNS
            key={pos.id}
            id={pos.id}
            symbol={pos.symbol}
            quantity={pos.quantity}
            cost_basis={pos.cost_basis}
            date_acquired={pos.date_acquired}
            gainLoss={pos.gainLoss}
          />
        )
      }
      <div style={{ height: '20px' }} />
      {
        nonOptionPositions.map(pos =>
          <PositionChitRNS
            key={pos.id}
            id={pos.id}
            symbol={pos.symbol}
            quantity={pos.quantity}
            cost_basis={pos.cost_basis}
            date_acquired={pos.date_acquired}
            gainLoss={pos.gainLoss}
          />
        )
      }
    </div>
  )
}

export default PositionChitsController
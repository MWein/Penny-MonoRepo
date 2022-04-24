import Typography from '@mui/material/Typography'
import PositionChit, { PositionChitProps } from '../components/PositionChit'


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

  // Sorts alphabetically, then separates by long and short positions
  const alphabeticallySorted = positions.sort((a, b) => a.ticker.localeCompare(b.ticker))
  const shortPositions = alphabeticallySorted.filter(pos => pos.side === 'short')
  const longPositions = alphabeticallySorted.filter(pos => pos.side === 'long')
  const sortedPositions = [ ...longPositions, ...shortPositions ]

  return (
    <div style={{ display: 'inline-block', marginTop: '7px' }}>
      {
        sortedPositions.map(pos =>
          <PositionChit
            key={pos.ticker}
            ticker={pos.ticker}
            side={pos.side}
            gainLoss={pos.gainLoss}
            maxLoss={pos.maxLoss}
            maxGain={pos.maxGain}
            hasPut={pos.hasPut}
            hasCall={pos.hasCall}
          />
        )
      }
    </div>
  )
}

export default PositionChitsController
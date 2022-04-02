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

  return (
    <div style={{ display: 'inline-block', marginTop: '7px' }}>
      {
        positions.map(pos =>
          <PositionChit
            key={pos.ticker}
            ticker={pos.ticker}
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
import Typography from '@mui/material/Typography'
import { isOption } from '../common/optionSymbolParser'
import PositionChitRNS, { PositionChitProps } from '../components/PositionChitRNS'
import DayChit from '../components/DayChit'


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
  const optionPositions = positions.filter(pos => isOption(pos.symbol))
    .sort((a, b) => new Date(a.date_acquired).valueOf() - new Date(b.date_acquired).valueOf())

  // const datesWithPositions = uniq(optionPositions.map(pos => pos.date_acquired))
  //   .sort((a, b) => new Date(a).valueOf() - new Date(b).valueOf())
  const dates = []
  let currentDate = new Date()
  while (dates.length < 5) {
    // Only push weekdays
    if (currentDate.getDay() < 6) {
      dates.unshift(currentDate.toISOString().split('T')[0])
    }
    currentDate.setDate(currentDate.getDate() - 1)
  }

  const positionsGroupedByDate = dates
    .map(date => {
      const positionsAcquiredOnDate = optionPositions.filter(pos => pos.date_acquired === date)

      return {
        date: new Date(date),
        positions: positionsAcquiredOnDate
      }
    })


  return (
    <div style={{ display: 'inline-block', marginTop: '7px', width: '100%' }}>
      <div style={{ display: 'inline-flex', width: '100%' }}>
        {
          positionsGroupedByDate.map(group => (
              <DayChit
                date={group.date}
                positions={group.positions}
              />
            )
          )
        }
      </div>

      <div style={{ height: '15px' }} />
      {
        optionPositions.map(pos =>
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
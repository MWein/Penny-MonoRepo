import { useState } from 'react'
import Typography from '@mui/material/Typography'
import { isOption } from '../common/optionSymbolParser'
import PositionChitRNS from '../components/PositionChitRNS'
import { Position } from '../common/types'
import DayChit from '../components/DayChit'
import SellPositionsModal from '../components/SellPositionsModal'

export type PositionChitsControllerProps = {
  positions: Position[],
}

const PositionChitsController = ({
  positions,
}: PositionChitsControllerProps) => {
  const [ positionsToClose, setPositionsToClose ] = useState<Position[]>([])

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


  const nonOptionPositions = positions.filter(pos => !isOption(pos.symbol))
  const optionPositions = positions.filter(pos => isOption(pos.symbol))
    .sort((a, b) => new Date(a.date_acquired).valueOf() - new Date(b.date_acquired).valueOf())

  const dates = []
  let currentDate = new Date()
  while (dates.length < 6) {
    // Only push weekdays
    if (currentDate.getDay() < 6 && currentDate.getDay() > 0) {
      dates.unshift(currentDate.toISOString().split('T')[0])
    }
    currentDate.setDate(currentDate.getDate() - 1)
  }

  const positionsGroupedByDate = dates.map(date => ({
    date: new Date(date),
    positions: optionPositions.filter(pos => pos.date_acquired === date)
  }))

  return (
    <>
      <SellPositionsModal
        positionsToClose={positionsToClose}
        onClose={() => setPositionsToClose([])}
      />

      <div style={{ display: 'inline-block', marginTop: '7px', width: '100%' }}>
        <div style={{ display: 'inline-flex', width: '100%' }}>
          {
            positionsGroupedByDate.map(group => (
                <DayChit
                  date={group.date}
                  positions={group.positions}
                  onClick={() => setPositionsToClose(group.positions)}
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
              onClick={() => setPositionsToClose([ pos ])}
              clickable
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
    </>
  )
}

export default PositionChitsController
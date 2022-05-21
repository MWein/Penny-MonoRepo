import { useState } from 'react'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import { moneyFormat } from '../common/formatting'
import Button from '@mui/material/Button'
import { Position } from '../common/types'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import { closePositions } from '../network/closePositions'

export type SellPositionsModalProps = {
  positionsToClose: Position[]
  onClose: () => void,
}

const SellPositionsModal = ({
  positionsToClose = [],
  onClose = () => {}
}: SellPositionsModalProps) => {
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ chickenTest, setChickenTest ] = useState<boolean>(false)

  const positionsToCloseTotalGL = positionsToClose.reduce((acc, pos) => acc + pos.gainLoss, 0)

  const handleSell = async () => {
    setLoading(true)
    await closePositions(positionsToClose)
    handleClose()
  }

  const handleClose = () => {
    setChickenTest(false)
    setLoading(false)
    onClose()
  }

  const handleChickenSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChickenTest(event.target.checked)
  }

  return (
    <Modal
      open={positionsToClose.length > 0}
      disableEnforceFocus
    >
      <Paper style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        padding: '15px'
      }}>
        {/* Hacky, I know. I don't care */}
        {
          loading ? (
            <CircularProgress
              style = {{
                position: 'absolute',
                top: '40%',
                left: '47%',
              }}
            />
          ) : null
        }

        <div style={{ display: 'flex' }}>
          <Typography style={{ flex: 1 }} variant='h6'>
            Sell the Following Positions?
          </Typography>
          <Typography style={{
            color: positionsToCloseTotalGL > 0 ? 'green' : 'red'
          }} variant='h6'>
            {moneyFormat(positionsToCloseTotalGL)}
          </Typography>
        </div>
        <div style={{
          marginTop: '10px',
          marginBottom: '10px',
          height: '170px',
          overflow: 'scroll',
          overflowX: 'hidden'
        }}>
          {positionsToClose.sort((a, b) => b.gainLoss - a.gainLoss).map(pos => {
            return (
              <div key={pos.id} style={{ display: 'flex' }}>
                <Typography style={{ flex: 1, display: 'inline-block' }}>
                  {pos.symbol}
                </Typography>
                <Typography style={{ marginRight: '5px', display: 'inline-block', color: pos.gainLoss > 0 ? 'green' : 'red' }}>
                  {moneyFormat(pos.gainLoss)}
                </Typography>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex' }}>
          <FormControlLabel
            style={{ flex: 1 }}
            control={<Switch disabled={loading} checked={chickenTest} onChange={handleChickenSwitch} />}
            label="I'm Sure"
          />
          <Button
            onClick={handleClose}
            variant='outlined'
            color='secondary'
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            disabled={!chickenTest || loading}
            style={{ marginLeft: '10px' }}
            variant='outlined'
            onClick={handleSell}
          >
            Sell
          </Button>
        </div>
      </Paper>
    </Modal>
  )
}

export default SellPositionsModal
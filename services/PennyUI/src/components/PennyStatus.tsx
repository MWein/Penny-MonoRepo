import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import NoConnectionIcon from '@mui/icons-material/SignalCellularConnectedNoInternet0Bar'
import GoodConnectionIcon from '@mui/icons-material/SignalCellularAlt'


type PennyStatusProps = {
  loading: boolean,
  healthy: boolean,
}

const PennyStatus = ({
  loading,
  healthy,
}: PennyStatusProps) => {
  const statusMessage = () => {
    if (loading) {
      return 'Checking on Penny'
    }
    return healthy ? 'Connected' : 'Failed to Connect'
  }

  const SignalIcon = healthy ? GoodConnectionIcon : NoConnectionIcon
  const iconColor = healthy ? 'green' : 'red'


  return (
    <Paper style={{ height: 'fit-content', display: 'flex' }}>
      {
        loading ? (
          <div style={{ paddingTop: '12px', paddingLeft: '10px', paddingRight: '9px' }}>
            <CircularProgress size={25} />
          </div>
        ) : (
          <SignalIcon
            style={{
              color: iconColor,
              paddingLeft: '15px',
              paddingRight: '0px',
              padding: '10px',
              transform: 'translate(0, 4px)'
            }}
          />
        )
      }

      <Typography variant='h6' style={{ padding: '10px', paddingLeft: '5px' }}>
        {statusMessage()}
      </Typography>
    </Paper>
  )
}

export default PennyStatus
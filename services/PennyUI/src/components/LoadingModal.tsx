import Paper from '@mui/material/Paper'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

const LoadingModal = () => {
  return (
    <Modal
      keepMounted
      open
    >
      <Paper
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: 150,
          width: 400,
          border: '2px solid #000',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div>
          <Typography variant="h6" component="h2">
            Loading
          </Typography>
          <div style={{ height: '10px' }} />
          <CircularProgress />
        </div>
      </Paper>
    </Modal>
  )
}

export default LoadingModal
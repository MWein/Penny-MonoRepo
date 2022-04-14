import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

export type CronTime = {
  cronName: string,
  success: boolean,
  date: string,
  errorMessage?: string,
}

export type CronTimesPanelProps = {
  crons: CronTime[]
  checkingCrons: boolean,
}

const CronTimesPanel = ({
  crons,
  checkingCrons,
}: CronTimesPanelProps) => {
  const createCronRow = (cron: CronTime) => {
    const hoursSince = Number(
      (Math.abs(new Date(cron.date).valueOf() - new Date().valueOf()) / 36e5).toFixed(0)
    )
    const hoursSinceStr = hoursSince > 24 ? '>24 Hrs' : `${hoursSince} Hr${hoursSince === 1 ? '' : 's'}`

    return (
      <>
        <div style={{ display: 'flex' }}>
          <Typography style={{ display: 'inline-block', width: '95px' }}>
            {cron.cronName}
          </Typography>

          <Typography style={{ textAlign: 'center', flex: 1 }}>
            {hoursSinceStr}
          </Typography>

          <Typography style={{
            color: cron.success ? 'green' : 'red',
            display: 'inline-block',
            width: '65px',
            textAlign: 'right'
          }}>
            {cron.success ? 'Success' : 'Failure'}
          </Typography>
        </div>
      </>
    )
  }


  if (checkingCrons) {
    return (
      <Paper style={{ height: 'fit-content', display: 'flex' }}>
        <div style={{ paddingTop: '12px', paddingLeft: '10px', paddingRight: '9px' }}>
          <CircularProgress size={25} />
        </div>
        <Typography variant='h6' style={{ padding: '10px', paddingLeft: '5px' }}>
          Checking on Crons
        </Typography>
      </Paper>
    )
  }


  return (
    <>
      <Paper style={{ padding: '10px' }}>
        {
          crons.length === 0 && (
            <Typography variant='h5' style={{ textAlign: 'center' }}>
              No Crons
            </Typography>
          )
        }
        {crons.map((cron, index) => createCronRow(cron))}
      </Paper>
    </>
  )
}

export default CronTimesPanel
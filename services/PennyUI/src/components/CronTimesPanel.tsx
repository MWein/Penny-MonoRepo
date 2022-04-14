import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

export type CronTime = {
  cronName: string,
  success: boolean,
  date: string,
  errorMessage?: string,
}

export type CronTimesPanelProps = {
  crons: CronTime[]
}

const CronTimesPanel = ({
  crons
}: CronTimesPanelProps) => {
  const createCronRow = (cron: CronTime) => {
    const hoursSince = Number(
      (Math.abs(new Date(cron.date).valueOf() - new Date().valueOf()) / 36e5).toFixed(0)
    )
    const hoursSinceStr = hoursSince > 24 ? '>24 Hrs' : `${hoursSince} Hrs`

    return (
      <>
        <div style={{ display: 'flex' }}>
          <Typography style={{ display: 'inline-block', width: '90px' }}>
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
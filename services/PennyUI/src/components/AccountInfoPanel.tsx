import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { moneyFormat, moneyColor } from '../common/formatting'

const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]

type AccountInfoPanelProps = {
  accountEquity: number,
}

const AccountInfoPanel = () => {
  const currentWeekEarnings = 564.1248
  const allTimeEarnings = 1000000

  const createValueRow = (
    label: string,
    value: number,
    withDivider: boolean = false,
    positiveTextColor: string = 'black'
  ) => {
    return (
      <>
        <Typography variant='subtitle1' style={{ textAlign: 'center', width: '100%' }}>
          {label}
        </Typography>
        <Typography variant='h5' style={{ textAlign: 'center', width: '100%', color: moneyColor(value, positiveTextColor) }}>
          {moneyFormat(value)}
        </Typography>
        {withDivider && <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />}
      </>
    )
  }

  const today = new Date()
  const currentMonth = months[today.getUTCMonth()]
  //const lastMonth = months[today.getUTCMonth() - 1] || 'Dec'
  const thisYear = today.getFullYear()
  const lastYear = thisYear - 1

  return (
    <>
      <Paper style={{ padding: '10px' }}>
        <Typography variant='h4' style={{ textAlign: 'center', width: '100%' }}>
          {moneyFormat(10000.0164)}
        </Typography>
        <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />
        {createValueRow('This Week', currentWeekEarnings, true, 'green')}
        {createValueRow(currentMonth, allTimeEarnings, true)}
        {createValueRow(`${thisYear}`, allTimeEarnings, true)}
        {createValueRow('All Time', allTimeEarnings)}
      </Paper>

      <div style={{ height: '10px' }} />

      {/* <Paper style={{ padding: '10px' }}>
        {createValueRow(lastMonth, allTimeEarnings, true)}
        {createValueRow(`${lastYear}`, allTimeEarnings)}
      </Paper>

      <div style={{ height: '10px' }} /> */}

      <Paper style={{ padding: '10px' }}>
        <Typography variant='h5' style={{ textAlign: 'center', width: '100%' }}>
          Estimated Theft
        </Typography>
        <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />
        {createValueRow(`${thisYear}`, allTimeEarnings, true)}
        {createValueRow(`${lastYear}`, allTimeEarnings)}
      </Paper>
    </>
  )
}

export default AccountInfoPanel
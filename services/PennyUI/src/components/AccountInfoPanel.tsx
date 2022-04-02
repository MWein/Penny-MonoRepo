import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { moneyFormat, moneyColor, months } from '../common/formatting'

export type AccountInfoPanelProps = {
  equity: number,
  weekEarnings: number,
  monthEarnings: number,
  yearEarnings: number,
  theft: number,
  lastYearTheft: number,
}

const AccountInfoPanel = ({
  equity,
  weekEarnings,
  monthEarnings,
  yearEarnings,
  theft,
  lastYearTheft,
}: AccountInfoPanelProps) => {
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
  const thisYear = today.getFullYear()
  const lastYear = thisYear - 1

  return (
    <>
      <Paper style={{ padding: '10px' }}>
        <Typography variant='h4' style={{ textAlign: 'center', width: '100%' }}>
          {moneyFormat(equity)}
        </Typography>
        <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />
        {createValueRow('This Week', weekEarnings, true, 'green')}
        {createValueRow(currentMonth, monthEarnings, true)}
        {createValueRow(`${thisYear}`, yearEarnings)}
      </Paper>

      <div style={{ height: '10px' }} />

      <Paper style={{ padding: '10px' }}>
        <Typography variant='h5' style={{ textAlign: 'center', width: '100%' }}>
          Estimated Theft
        </Typography>
        <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />
        {createValueRow(`${thisYear}`, theft, true)}
        {createValueRow(`${lastYear}`, lastYearTheft)}
      </Paper>
    </>
  )
}

export default AccountInfoPanel
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { moneyFormat, moneyColor, months } from '../common/formatting'

export type AccountInfoPanelProps = {
  equity: number,
  weekEarnings: number,
  currentValueLong: number,
  currentValueShort: number,
  weekPercReturn: number,
  monthEarnings: number,
  monthPercReturn: number,
  yearEarnings: number,
  yearPercReturn: number,
  theft: number,
  lastYearTheft: number,
}

const AccountInfoPanel = ({
  equity,
  weekEarnings,
  currentValueLong,
  currentValueShort,
  weekPercReturn,
  monthEarnings,
  monthPercReturn,
  yearEarnings,
  yearPercReturn,
  theft,
  lastYearTheft,
}: AccountInfoPanelProps) => {
  const createValueRow = (
    label: string,
    percentReturn: number | null,
    value: number,
    withDivider: boolean = false,
    positiveTextColor: string = 'black'
  ) => {
    const showPercentReturn = () => percentReturn === null ? null : (
      <>
        <div style={{ width: '5px', display: 'inline-block' }} />
        <Typography
          variant='subtitle1'
          style={{ display: 'inline-block', color: percentReturn > 0 ? 'green' : 'red' }}
        >
          {percentReturn > 0 && '+'}{percentReturn}%
        </Typography>
      </>
    )

    return (
      <>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Typography variant='subtitle1' style={{ display: 'inline-block' }}>
            {label}
          </Typography>
          {showPercentReturn()}
        </div>
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
  console.log(lastYear) // To keep TS from yelling at me

  return (
    <>
      <Paper style={{ padding: '10px' }}>
        <Typography variant='h4' style={{ textAlign: 'center', width: '100%' }}>
          {moneyFormat(equity)}
        </Typography>
        <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />
        {createValueRow('This Week', weekPercReturn, weekEarnings, true, 'green')}


        {/* New Value Row */}
        <>
          <div style={{ textAlign: 'center', display: 'flex' }}>
            <Typography variant='subtitle1' style={{ flex: 1, display: 'inline-block', textAlign: 'center' }}>
              Long
            </Typography>
            <Typography variant='subtitle1' style={{ flex: 1, display: 'inline-block', textAlign: 'center' }}>
              Short
            </Typography>
          </div>

          <div style={{ textAlign: 'center', display: 'flex' }}>
            <Typography variant='h6' style={{ flex: 1, display: 'inline-block', textAlign: 'center', color: moneyColor(currentValueLong, 'green') }}>
              {moneyFormat(currentValueLong)}
            </Typography>
            <Typography variant='h6' style={{ display: 'inline-block', flex: 1, textAlign: 'center', color: moneyColor(currentValueShort, 'green') }}>
              {moneyFormat(currentValueShort)}
            </Typography>
          </div>

          <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />
        </>
        {/* New Value Row */}
        


        {createValueRow(currentMonth, monthPercReturn, monthEarnings, true)}
        {createValueRow(`${thisYear}`, yearPercReturn, yearEarnings)}
      </Paper>

      <div style={{ height: '10px' }} />

      <Paper style={{ padding: '10px' }}>
        <Typography variant='h5' style={{ textAlign: 'center', width: '100%' }}>
          Estimated Theft
        </Typography>
        <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />
        {createValueRow(`${thisYear}`, null, theft)}
        {/* {createValueRow(`${lastYear}`, null, lastYearTheft)} */}
      </Paper>
    </>
  )
}

export default AccountInfoPanel
import AccountInfoPanel, { AccountInfoPanelProps } from './AccountInfoPanel'
import CronTimesPanel, { CronTimesPanelProps } from './CronTimesPanel'
import PennyStatus from './PennyStatus'
import LoadingModal from './LoadingModal'
import PositionChitsControllerRNS, { PositionChitsControllerProps } from '../controllers/PositionChitsControllerRNS'


type ShowcaseProps = {
  loading: boolean,
  checkingPenny: boolean,
  pennyHealthy: boolean,
} & AccountInfoPanelProps & PositionChitsControllerProps & CronTimesPanelProps


const ShowcaseRNS = ({
  loading,
  checkingPenny,
  pennyHealthy,
  equity,
  weekEarnings,
  monthEarnings,
  yearEarnings,
  theft,
  lastYearTheft,
  positions,
  crons,
  checkingCrons,
}: ShowcaseProps) => {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ padding: '10px', width: '250px', minWidth: '250px' }}>
          <PennyStatus
            loading={checkingPenny}
            healthy={pennyHealthy}
          />
          <div style={{ height: '10px' }} />
          <CronTimesPanel
            crons={crons}
            checkingCrons={checkingCrons}
          />
          <div style={{ height: '10px' }} />
          <AccountInfoPanel
              equity={equity}
              weekEarnings={weekEarnings}
              monthEarnings={monthEarnings}
              yearEarnings={yearEarnings}
              theft={theft}
              lastYearTheft={lastYearTheft}
          />
        </div>
        <PositionChitsControllerRNS positions={positions} />
      </div>
      {loading && <LoadingModal />}
    </>
  )
}

export default ShowcaseRNS
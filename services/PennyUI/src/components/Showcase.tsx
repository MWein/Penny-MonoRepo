import AccountInfoPanel, { AccountInfoPanelProps } from './AccountInfoPanel'
import PennyStatus from './PennyStatus'
import LoadingModal from './LoadingModal'
import PositionChitsController, { PositionChitsControllerProps } from '../controllers/PositionChitsController'


type ShowcaseProps = {
  loading: boolean,
  checkingPenny: boolean,
  pennyHealthy: boolean,
} & AccountInfoPanelProps & PositionChitsControllerProps


const Showcase = ({
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
          <AccountInfoPanel
              equity={equity}
              weekEarnings={weekEarnings}
              monthEarnings={monthEarnings}
              yearEarnings={yearEarnings}
              theft={theft}
              lastYearTheft={lastYearTheft}
          />
        </div>
        <PositionChitsController positions={positions} />
      </div>
      {loading && <LoadingModal />}
    </>
  )
}

export default Showcase
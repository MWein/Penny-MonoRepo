import PositionChit from './components/PositionChit'
import AccountInfoPanel from './components/AccountInfoPanel'
import PennyStatus from './components/PennyStatus'

const App = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ padding: '10px', width: '500px' }}>
        <PennyStatus
          loading={false}
          healthy={true}
        />
        <div style={{ height: '10px' }} />
        <AccountInfoPanel />
      </div>

      <div style={{ display: 'inline-block', marginTop: '5px' }}>
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='IWM' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='SPY' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
        <PositionChit ticker='TQQQ' gainLoss={50} maxLoss={-20} maxGain={100} hasPut />
      </div>
    </div>
  )
}

export default App

import PositionChit from './components/PositionChit'

const App = () => {
  return (
    <div>
      <PositionChit ticker='TQQQ' gainLoss={40} maxGain={50} maxLoss={-7} hasCall hasPut />
      <PositionChit ticker='SPY' gainLoss={40} maxGain={50} maxLoss={-7} hasCall />
      <PositionChit ticker='IWM' gainLoss={40} maxGain={50} maxLoss={-7} hasPut />
    </div>
  )
}

export default App

import PositionChit from './components/PositionChit'

const App = () => {
  return (
    <div>
      <PositionChit ticker='TQQQ' gainLoss={70} maxGain={70} maxLoss={-30} hasCall hasPut />
      <PositionChit ticker='SPY' gainLoss={40} maxGain={100} maxLoss={-8} hasCall />
      <PositionChit ticker='IWM' gainLoss={20} maxGain={40} maxLoss={-15} hasPut />
      <PositionChit ticker='SPY' gainLoss={-2} maxGain={50} maxLoss={-20} hasPut />
      <PositionChit ticker='TQQQ' gainLoss={5} maxGain={50} maxLoss={-100} hasCall />
      <PositionChit ticker='IWM' gainLoss={-12} maxGain={50} maxLoss={-7} hasPut />
      <PositionChit ticker='IWM' gainLoss={56} maxGain={50} maxLoss={-7} hasPut />
    </div>
  )
}

export default App

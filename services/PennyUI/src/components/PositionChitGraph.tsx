import './PositionChit.css'

const calcPosition = (
  graphStart: number,
  graphEnd: number,
  valueMin: number,
  valueMax: number,
  value: number,
): number => {
  if (value < valueMin) {
      return graphStart
  }
  if (value > valueMax) {
      return graphEnd
  }
  const valueWidth = valueMax - valueMin
  const relativeValuePos = Math.abs(valueMin - value)
  const graphWidth = graphEnd - graphStart
  return ((graphWidth * relativeValuePos) / valueWidth) + graphStart
}

type PositionChitGraphProps = {
  gainLoss: number,
  maxLoss: number,
  maxGain: number,
}

const PositionChitGraph = ({
  gainLoss,
  maxGain,
  maxLoss,
}: PositionChitGraphProps) => {
  const graphWidth = '110px'
  const graphHeight= '50px'

  if (gainLoss < maxLoss || gainLoss > maxGain) {
    return (
      <div
        className='vertical-center'
        style={{
          background: 'darkGray',
          width: graphWidth,
          height: graphHeight,
          textAlign: 'center' 
        }}
      >
        Out of Bounds
      </div>
    )
  }

  // Graph position settings
  const graphStartPos = 10
  const graphEndPos = 90
  const maxGainLossHeight = 45

  // Color settings
  const baseGraphColor = 'black'
  const zeroTickColor = 'black'

  // Font Size
  const baseFontSize = '12px'
  const gainLossFontSize = '15px'

  const gainLossTickColor = gainLoss > 0 ? 'green' : 'red'

  const zeroPosition = calcPosition(graphStartPos, graphEndPos, maxLoss, maxGain, 0)
  const gainLossPosition = calcPosition(graphStartPos, graphEndPos, maxLoss, maxGain, gainLoss)


  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={graphHeight} width={graphWidth} viewBox="0 0 100 50">
      <g>
        {/* Base Graph */}
        <path d={`M ${graphStartPos} 25 L ${graphEndPos} 25`} stroke={baseGraphColor} />
        <path d={`M ${graphStartPos} 15 L ${graphStartPos} 30`} stroke={baseGraphColor} />
        <path d={`M ${graphEndPos} 15 L ${graphEndPos} 30`} stroke={baseGraphColor} />

        {/* Zero Tick */}
        <path d={`M ${zeroPosition} 20 L ${zeroPosition} 25`} stroke={zeroTickColor} />

        {/* Gain Loss Tick */}
        <path d={`M ${gainLossPosition} 20 L ${gainLossPosition} 25`} stroke={gainLossTickColor} strokeWidth={2} />

        {/* Max Loss */}
        <text text-anchor="middle" x={`${graphStartPos}`} y={`${maxGainLossHeight}`} style={{ fontSize: baseFontSize }}>{maxLoss}</text>

        {/* Zero */}
        <text text-anchor="middle" x={zeroPosition} y="35" style={{ fontSize: baseFontSize }}>0</text>

        {/* Max Gain */}
        <text text-anchor="middle" x={`${graphEndPos}`} y={`${maxGainLossHeight}`} style={{ fontSize: baseFontSize }}>{maxGain}</text>

        {/* Gain Loss */}
        <text text-anchor="middle" x={gainLossPosition} y="15" style={{ fontSize: gainLossFontSize }} fill={gainLossTickColor}>{gainLoss}</text>
      </g>
    </svg>
  )
}

export default PositionChitGraph
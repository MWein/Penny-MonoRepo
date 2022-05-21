import { sellPositions } from '../services/sellPositions'

const sellPositionsController = async (req, res): Promise<void> => {
  const positions = req.body
  await sellPositions(positions)
  res.send('Done')
}

export {
  sellPositionsController,
}
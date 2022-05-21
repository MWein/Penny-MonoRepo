import { sellPositions } from '../services/sellPositions'

const sellPositionsController = async (req, res): Promise<void> => {
  const positions = req.body
  try {
    await sellPositions(positions)
    res.send('Done')
  } catch (e) {
    res.status(500).send('Error')
  }
}

export {
  sellPositionsController,
}
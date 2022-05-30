import * as tradier from '@penny/tradier'

const sellPositionsController = async (req, res): Promise<void> => {
  const positions = req.body
  try {
    await tradier.closePositionsIndividual(positions)
    res.send('Done')
  } catch (e) {
    res.status(500).send('Error')
  }
}

export {
  sellPositionsController,
}
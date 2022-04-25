import { nuke } from '../services/nuke'

const nukeController = async (req, res) : Promise<void> => {
  if (![ 'all', 'short', 'long' ].includes(req.query.type)) {
    res.status(500).send('Error')
    return
  }

  try {
    await nuke(req.query.type)
    res.status(200).send('Success')
  } catch (e) {
    res.status(500).send('Error')
  }
}

export {
  nukeController
}
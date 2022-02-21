import * as logService from '@penny/logger'

const getLogsController = async (req, res) : Promise<void> => {
  try {
    const logs = await logService.getLogs()
    res.json(logs)
  } catch (e) {
    res.status(500).send('Error')
  }
}

export {
  getLogsController
}
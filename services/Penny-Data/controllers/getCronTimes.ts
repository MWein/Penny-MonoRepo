import * as logService from '@penny/logger'
import { uniq } from 'lodash'

const getCronTimesController = async (req, res) : Promise<void> => {
  try {
    const cronLogs = await logService.getCronLogs()

    const lastCronRuns = uniq(cronLogs.map(log => log.cronName)).map(
      name => cronLogs.find(log => log.cronName === name)
    )

    res.json(lastCronRuns)
  } catch (e) {
    res.status(500).send('Error')
  }
}

export {
  getCronTimesController
}
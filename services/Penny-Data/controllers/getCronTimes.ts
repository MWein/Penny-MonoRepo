import * as logService from '@penny/logger'
import { uniq } from 'lodash'

export const getCronTimesController = async (req, res) : Promise<void> => {
  try {
    const cronLogs = await logService.getCronLogs()

    const lastCronRuns = uniq(cronLogs.map(log => log.cronName))
      .sort() // Sort cron names alphabetically
      .map(
        name => cronLogs.find(log => log.cronName === name)
      )

    res.json(lastCronRuns)
  } catch (e) {
    res.status(500).send('Error')
  }
}

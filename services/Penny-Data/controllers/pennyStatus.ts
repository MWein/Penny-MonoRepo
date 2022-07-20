import * as pennyStatusUtil from '../services/pennyStatus'


export const pennyStatusController = async (req, res) : Promise<void> => {
  try {
    const lastLogDate: string = await pennyStatusUtil.getLastLogDate()
    const timeSince = new Date().valueOf() - new Date(lastLogDate).valueOf()
    const healthy = timeSince < 3600020 // 1 hour and 20ms

    res.json({
      healthy
    })
  } catch (e) {
    res.status(500).send('Error')
  }
}
import * as pennyStatusUtil from '../services/pennyStatus'


const pennyStatusController = async (req, res) : Promise<void> => {
  try {
    const lastLogDate: string = await pennyStatusUtil.getLastLogDate()
    const timeSince = new Date().getUTCMilliseconds() - new Date(lastLogDate).getUTCMilliseconds()
    const healthy = timeSince < 3600020 // 1 hour and 20ms

    res.json({
      healthy
    })
  } catch (e) {
    res.status(500).send('Error')
  }
}

export {
  pennyStatusController
}
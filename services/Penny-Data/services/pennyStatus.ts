import { logModel } from '@penny/db-models'


const getLastLogDate = async () : Promise<String> => {
  const lastLog = await logModel.findOne().sort({ date: -1 }).select('date')
  return lastLog.date
}


export {
  getLastLogDate
}
import { logModel } from '@penny/db-models'


export const getLastLogDate = async () : Promise<string> => {
  const lastLog = await logModel.findOne().sort({ date: -1 }).select('date')
  return lastLog.date
}

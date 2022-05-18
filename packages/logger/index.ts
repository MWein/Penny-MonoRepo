import { logModel, cronModel } from '@penny/db-models'

export type LogType = 'info' | 'ping' | 'error'
export type CronType = 'ShortIC' | 'LongIC' | 'ShortGTC' | 'CloseExp' | 'CloseShort' | 'Housekeeping' | 'Snapshot' | 'RNS Init' | 'RNS Snap'

export type LogObject = {
  type?: LogType,
  message: string
}

// Return types for get functions
type Log = {
  date: string
  type: LogType,
  message: string,
}
type CronLog = {
  date: string,
  cronName: CronType,
  success: boolean,
  errorMessage?: string,
}


// Log data is the object that will go directly to Mongo
export const _logWithObject = async (logData: LogObject) => {
  try {
    const newLog = new logModel(logData)
    await newLog.save()
    if (logData.type !== 'ping') {
      console.log(logData.type || 'info', ':', logData.message)
    }
  } catch (e) {
    console.log('Error reaching database')
  }
}


export const _logWithMessage = async (message: string) => {
  try {
    const newLog = new logModel({
      message,
    })
    await newLog.save()
    console.log('info', ':', message)
  } catch (e) {
    console.log('Error reaching database')
  }
}


export const log = async (logData : string | LogObject) => {
  if (typeof logData === 'string') {
    await _logWithMessage(logData)
  }
  if (typeof logData === 'object') {
    await _logWithObject(logData)
  }
}


export const logCron = async (cronName: CronType, success: boolean, errorMessage?: string) => {
  try {
    if (errorMessage) {
      const newLog = new cronModel({ cronName, success, errorMessage })
      await newLog.save()
      return
    }

    const newLog = new cronModel({ cronName, success })
    await newLog.save()
  } catch (e) {
    console.log('Error reaching database')
  }
}

export const getLogs = async () : Promise<Log[]> => {
  const logs = await logModel.find().sort({ date: -1 }).select('-_id -__v')
  return logs
}

export const getCronLogs = async () : Promise<CronLog[]> => {
  const logs = await cronModel.find().sort({ date: -1 }).select('-_id -__v')
  return logs
}


export const clearOldLogs = async () => {
  try {
    const DELETEOLDERTHANDAYS = 30
    const today = new Date()
    const priorDate = new Date().setDate(today.getDate() - DELETEOLDERTHANDAYS)
    await logModel.deleteMany({ date: { $lte: priorDate } })
    await cronModel.deleteMany({ date: { $lte: priorDate } })
  } catch (e) {
    console.log('Error reaching database')
  }
}
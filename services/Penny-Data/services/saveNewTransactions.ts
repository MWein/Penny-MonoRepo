import * as tastyCSVParser from '@penny/tasty-csv-parser'
import { tastyHistoryModel } from '@penny/db-models'
import { createHash } from 'crypto'


type SaveTransactionsResult = {
  error: boolean,
  message: string,
}


export const saveNewTransactions = async (csvData: string): Promise<SaveTransactionsResult> => {
  try {
    if (!tastyCSVParser.verify(csvData)) {
      return {
        error: true,
        message: 'Invalid CSV'
      }
    }
  
    const history = tastyCSVParser.historyCSVToJson(csvData)
      .map(hist => ({
        ...hist,
        hash: createHash('sha256').update(JSON.stringify(hist)).digest('hex')
      }))
  
    const hashes = history.map(hist => hist.hash)
    const existingHashesRes = await tastyHistoryModel
      .find({ hash: { $in: hashes } }).select('hash').lean()
    const existingHashes = existingHashesRes.map(res => res.hash)
  
    const newHistory = history.filter(hist => !existingHashes.includes(hist.hash))
  
    if (newHistory.length === 0) {
      return {
        error: false,
        message: 'No new records added'
      }
    }
  
    await tastyHistoryModel.insertMany(newHistory)
  
    return {
      error: false,
      message: `Added ${newHistory.length} new record${newHistory.length === 1 ? '' : 's'}`
    }
  } catch (e) {
    return {
      error: true,
      message: 'Error processing CSV'
    }
  }
}
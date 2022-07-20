import * as saveTransactionsUtil from '../services/saveNewTransactions'

export const uploadCSVController = async (req, res, next) => {
  if (!req.files) {
    res.status(400).send('No file uploaded')
    return
  }

  const file = req.files[Object.keys(req.files)[0]]

  if (file.mimetype !== 'text/csv') {
    res.status(400).send('File must be a CSV')
    return
  }

  const csvData = file.data.toString()
  const result = await saveTransactionsUtil.saveNewTransactions(csvData)

  if (result.error) {
    res.status(500)
  }

  res.send(result.message)
}
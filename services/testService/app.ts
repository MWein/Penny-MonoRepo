require('dotenv').config({ path: '../../.env' })

import { incomeTargetModel, logModel } from '@penny/db-models'
import * as mongoose from 'mongoose'


const checkDB = async () => {
  const incomeModels = await incomeTargetModel.find()
  const logModels = await logModel.find()
  console.log(incomeModels)
  console.log(logModels)
}


// Recursively continuously try until the damn thing decides to work
const connectToDB = () => {
  console.log('Connecting to Database')

  mongoose.connect(process.env.CONNECTION_STRING, null, err => {
    if (err) {
      // Not much choice in logging to a database we can't connect to
      console.log('Database Connection Failure - Trying Again')

      connectToDB()
      return
    }

    checkDB()
  })
}

connectToDB()
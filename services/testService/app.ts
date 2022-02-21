require('dotenv').config({ path: '../../.env' })

import { incomeTargetModel, logModel } from '@penny/db-models'
import * as mongoose from 'mongoose'
import { getSettings } from '@penny/settings'
import { getLogs } from '@penny/logger'
import { getOptionChain } from '@penny/tradier'

const checkDB = async () => {
  const positions = await getOptionChain('AAPL', '2022-02-25')
  console.log(positions)
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
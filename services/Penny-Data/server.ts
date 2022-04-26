import app from './app'
import { saveAllData } from '../../packages/scribe'
import * as mongoose from 'mongoose'
const CronJob = require('cron').CronJob


const launchCrons = async () => {
  // Run every 15 minutes
  new CronJob('0 */15 * * * 1-5', saveAllData, null, true, 'America/New_York')
}


const port = 3001

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

    console.log('Connection Established')

    launchCrons()

    app.listen(port, () => {
      console.log(`Listening on Port ${port}`)
    })
  })
}

connectToDB()
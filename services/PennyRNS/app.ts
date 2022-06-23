const CronJob = require('cron').CronJob
const mongoose = require('mongoose')
const packageJson = require('../../package.json')

import { log, clearOldLogs } from '@penny/logger'
import { saveAllData } from '@penny/scribe'
import { closeExpiringPositions } from './core/closeExpiringPositions'
import { closeLongPositions } from './core/closeLongPositions'

import { cronFunc, masterCron } from './core/masterCron'


const launchCrons = async () => {
  log('StartingCrons')

  new CronJob('0 0 * * * *', () => {
    log({
      type: 'ping',
      message: 'Checking In'
    })
  }, null, true, 'America/New_York')

  // Save price information for long options
  new CronJob('0 */15 * * * 1-5', saveAllData, null, true, 'America/New_York')

  // Launch master cron (purchase long options, purchase stock, sell covered calls)
  new CronJob('0 50 9 * * 1-5', masterCron, null, true, 'America/New_York')

  // Close expiring options one hour before Tradier does it
  new CronJob('0 15 14 * * 1-5', () => cronFunc(closeExpiringPositions, 'CloseExp'), null, true, 'America/New_York')

  // Close long positions at 5am
  new CronJob('0 0 5 * * 1-5', () => cronFunc(closeLongPositions, 'CloseLong'), null, true, 'America/New_York')

  // Run every day at 4:10 NY time
  // 10 mins after market close
  new CronJob('0 10 16 * * *', () => cronFunc(clearOldLogs, 'Housekeeping'), null, true, 'America/New_York')

  // For deploy script checking
  console.log('Deployment successful RNS')
  console.log(packageJson.version)
}


// Recursively continuously try until the damn thing decides to work
const connectToDB = () => {
  console.log('Connecting to Database')

  mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) {
      // Not much choice in logging to a database we can't connect to
      console.log('Database Connection Failure - Trying Again')

      connectToDB()
      return
    }

    log({
      message: 'Connection Established'
    })

    launchCrons()
  })
}

connectToDB()
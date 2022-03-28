const CronJob = require('cron').CronJob
const mongoose = require('mongoose')

import { log } from '@penny/logger'

import {
  sellIronCondorBigThree,
  sellIronCondors
} from './core/sellIronCondor'

import {
  wingAdjustment
} from './core/wingAdjustment'

import {
  closeExpiringPositions
} from './core/closeExpiringPositions'

// import {
//   takeProfits
// } from './core/takeProfits'

//const { sellCoveredCalls } = require('./core/coveredCall')
//const { createGTCOrders } = require('./core/gtcOrders')
//const { log, clearOldLogs } = require('./utils/log')
//const { closeExpiringPuts } = require('./core/closeExpiringPuts')
//const { sellCashSecuredPuts } = require('./core/cashSecuredPut')
//const { allocateUnutilizedCash } = require('./core/allocateUnutilizedCash')
//const { sellSpreads } = require('./core/sellSpreads')


// const housekeeping = async () => {
//   try {
//     log('Clearing Old Logs')
//     await clearOldLogs()
//   } catch (e) {
//     log({
//       type: 'ERROR housekeeping',
//       message: e.toString()
//     })
//   }
// }


const sellOptions = async () => {
  try {

    //await sellIronCondorBigThree()
    await sellIronCondors()

    // Adjusting the wings may have actual cost more money than it saved
    // Lets try just letting the positions do their thing instead for a bit
    //await wingAdjustment()

    //await sellSpreads()

    // Commented out because this is not compatible with stuff (for now)
    // log('Selling Covered Calls')
    // await sellCoveredCalls()
    // log('Selling Cash Secured Puts')
    // await sellCashSecuredPuts()
  } catch (e) {
    log({
      type: 'error',
      message: e.toString()
    })
  }
}


const launchCrons = async () => {
  log('Starting Crons')

  new CronJob('0 0 * * * *', () => {
    log({
      type: 'ping',
      message: 'Checking In'
    })
  }, null, true, 'America/New_York')

  new CronJob('0 31 09 * * 1-6', () => {
    //log('Creating GTC Orders')
    //createGTCOrders()
  }, null, true, 'America/New_York')


  new CronJob('0 0 10 * * 1-4', sellOptions, null, true, 'America/New_York')
  //new CronJob('0 0 11 * * 1-5', sellOptions, null, true, 'America/New_York')
  //new CronJob('0 0 12 * * 1-5', sellOptions, null, true, 'America/New_York')
  new CronJob('0 0 13 * * 1-4', sellOptions, null, true, 'America/New_York')
  //new CronJob('0 0 14 * * 1-5', sellOptions, null, true, 'America/New_York')

  // One hour before Tradier does it
  new CronJob('0 15 14 * * 1-5', closeExpiringPositions, null, true, 'America/New_York')

  // Close expiring puts before options sales on fridays
  // new CronJob('0 0 09 * * 5', closeExpiringPuts, null, true, 'America/New_York')
  // new CronJob('0 0 11 * * 5', closeExpiringPuts, null, true, 'America/New_York')
  // new CronJob('0 0 13 * * 5', closeExpiringPuts, null, true, 'America/New_York')

  // Allocate unutilized money at the end of the day on fridays
  //new CronJob('30 0 15 * * 5', allocateUnutilizedCash, null, true, 'America/New_York')

  // Run every day at 4:10 NY time
  // 10 mins after market close
  new CronJob('0 10 16 * * *', () => {
    //housekeeping()
  }, null, true, 'America/New_York')

  console.log('Deployment successful')
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
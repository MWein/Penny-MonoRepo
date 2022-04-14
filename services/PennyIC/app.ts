const CronJob = require('cron').CronJob
const mongoose = require('mongoose')

import { log, logCron, clearOldLogs } from '@penny/logger'

// import {
//   sellIronCondors
// } from './core/sellIronCondor'

import { buyIronCondors } from './core/buyIronCondor'

import {
  closeExpiringPositions
} from './core/closeExpiringPositions'



const openIronCondorsCron = async () => {
  try {
    await buyIronCondors()
    logCron('OpenICs', true)
  } catch (e) {
    log({
      type: 'error',
      message: e.toString()
    })
    logCron('OpenICs', false, e.toString())
  }
}

const closeExpiringPositionsCron = async () => {
  try {
    await closeExpiringPositions()
    logCron('CloseExp', true)
  } catch (e) {
    log({
      type: 'error',
      message: e.toString()
    })
    logCron('CloseExp', false, e.toString())
  }
}

const housekeepingCron = async () => {
  try {
    await clearOldLogs()
    logCron('Housekeeping', true)
  } catch (e) {
    log({
      type: 'error',
      message: e.toString()
    })
    logCron('Housekeeping', false, e.toString())
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

  // new CronJob('0 31 09 * * 1-6', () => {
  //   //log('Creating GTC Orders')
  //   //createGTCOrders()
  // }, null, true, 'America/New_York')


  new CronJob('0 0 10 * * 1-4', openIronCondorsCron, null, true, 'America/New_York')
  new CronJob('0 0 13 * * 1-4', openIronCondorsCron, null, true, 'America/New_York')

  // One hour before Tradier does it
  new CronJob('0 15 14 * * 1-5', closeExpiringPositionsCron, null, true, 'America/New_York')

  // Run every day at 4:10 NY time
  // 10 mins after market close
  new CronJob('0 10 16 * * *', housekeepingCron, null, true, 'America/New_York')

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
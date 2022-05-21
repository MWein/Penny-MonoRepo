const CronJob = require('cron').CronJob
const mongoose = require('mongoose')
const packageJson = require('../../package.json')

import { log, logCron, clearOldLogs, CronType } from '@penny/logger'

import { saveAllData, saveAllSelections } from '../../packages/scribe'


// Possible removal
//import { buyIronCondors } from './core/buyIronCondor'
//import { createGTCShortOrders } from './core/createGTCShortOrders'
//import { closeOldShortPositions } from './core/closeOldShortPositions'


import { sellIronCondors } from './core/sellIronCondor'
import { closeExpiringPositions } from './core/closeExpiringPositions'


const cronFunc = async (func: Function, cronName: CronType) => {
    try {
      await func()
      logCron(cronName, true)
    } catch (e) {
      logCron(cronName, false, e.toString())
    }
}


// const openICs = async () => {
//   // Only buy on mon,tues,wed
//   if ([ 1, 2, 3, 4 ].includes(new Date().getDay())) {
//     await cronFunc(buyIronCondors, 'LongIC')
//   }
//   //await cronFunc(sellIronCondors, 'ShortIC')
//   //await cronFunc(createGTCShortOrders, 'ShortGTC')
// }

// const closeICs = async () => {
//   await cronFunc(closeExpiringPositions, 'CloseExp')
//   //await cronFunc(closeOldShortPositions, 'CloseShort')
// }

import { saveAndPurchase } from './rns/getATMOptions'

const launchCrons = async () => {
  // Code for PennyRNS but I'm too lazy to bother making a new one yet

  log('StartingCrons')

  new CronJob('0 0 * * * *', () => {
    log({
      type: 'ping',
      message: 'Checking In'
    })
  }, null, true, 'America/New_York')

  new CronJob('0 */15 * * * 1-5', saveAllData, null, true, 'America/New_York')

  new CronJob('0 50 9 * * 1-5', () => cronFunc(saveAndPurchase, 'RNS Init'), null, true, 'America/New_York')

  // One hour before Tradier does it
  new CronJob('0 15 14 * * 1-5', () => cronFunc(closeExpiringPositions, 'CloseExp'), null, true, 'America/New_York')

// Run every day at 4:10 NY time
  // 10 mins after market close
  new CronJob('0 10 16 * * *', () => cronFunc(clearOldLogs, 'Housekeeping'), null, true, 'America/New_York')

  // For deploy script checking
  console.log('Deployment successful')
  console.log(packageJson.version)

  return
  // Code for PennyIC
  log('Starting Crons')

  new CronJob('0 0 * * * *', () => {
    log({
      type: 'ping',
      message: 'Checking In'
    })
  }, null, true, 'America/New_York')

  new CronJob('0 */15 * * * 1-5', saveAllData, null, true, 'America/New_York')

  new CronJob('0 50 9 * * 1-5', () => cronFunc(saveAllSelections, 'RNS Init'), null, true, 'America/New_York')
  new CronJob('0 0 11 * * 1-4', () => cronFunc(sellIronCondors, 'ShortIC'), null, true, 'America/New_York')
  new CronJob('0 0 13 * * 1-4', () => cronFunc(sellIronCondors, 'ShortIC'), null, true, 'America/New_York')

  // One hour before Tradier does it
  new CronJob('0 15 14 * * 1-5', () => cronFunc(closeExpiringPositions, 'CloseExp'), null, true, 'America/New_York')

  // Run every day at 4:10 NY time
  // 10 mins after market close
  new CronJob('0 10 16 * * *', () => cronFunc(clearOldLogs, 'Housekeeping'), null, true, 'America/New_York')

  // For deploy script checking
  console.log('Deployment successful')
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
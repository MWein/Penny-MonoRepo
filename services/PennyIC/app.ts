const CronJob = require('cron').CronJob
const mongoose = require('mongoose')
const packageJson = require('../../package.json')

import { log, logCron, clearOldLogs, CronType } from '@penny/logger'

import { buyIronCondors } from './core/buyIronCondor'
import { sellIronCondors } from './core/sellIronCondor'
import { createGTCShortOrders } from './core/createGTCShortOrders'

import {
  closeExpiringPositions
} from './core/closeExpiringPositions'


const cronFunc = async (func: Function, cronName: CronType) => {
    try {
      await func()
      logCron(cronName, true)
    } catch (e) {
      logCron(cronName, false, e.toString())
    }
}


const openICs = async () => {
  // Only buy on mon,tues,wed
  if ([ 1, 2, 3 ].includes(new Date().getDay())) {
    await cronFunc(buyIronCondors, 'LongIC')
  }
  await cronFunc(sellIronCondors, 'ShortIC')
  await cronFunc(createGTCShortOrders, 'ShortGTC')
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


  new CronJob('0 0 10 * * 1-4', () => openICs, null, true, 'America/New_York')

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
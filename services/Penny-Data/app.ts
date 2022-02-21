require('dotenv').config({ path: '../../.env' })

import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import { pennyStatusController } from './controllers/pennyStatus'
import { getLogsController } from './controllers/getLogs'
//import { getGainLossController, getGainLossGraphController } from './controllers/gainLoss'
import { getSettingsController, setSettingsController } from './controllers/settings'
//import { getWatchlistController } from './controllers/watchlist'
//import { getIncomeTargetsController, createIncomeTargetController } from './controllers/incomeTargets'

//import { premiumEarnedController, premiumGraphController } from './controllers/premiumHistory'

const app = express()

app.use(bodyParser.json())
app.use(cors())


// Status endpoint that checks the last action by Penny via the logs database
app.get('/penny-status', pennyStatusController)

// Watchlist Endpoints
//app.get('/watchlist', getWatchlistController)

// Dump all logs from the database
app.get('/logs', getLogsController)


//app.get('/gain-loss', getGainLossController)
//app.get('/gain-loss-graph', getGainLossGraphController)

//app.get('/premium-earned', premiumEarnedController)
//app.get('/premium-graph', premiumGraphController)


// Settings
app.get('/settings', getSettingsController)
app.put('/settings', setSettingsController)


// Income target endpoints
//app.get('/income-targets', getIncomeTargetsController)
//app.post('/income-targets', createIncomeTargetController)


export default app
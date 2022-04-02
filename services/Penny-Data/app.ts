import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import { pennyStatusController } from './controllers/pennyStatus'
import { getLogsController } from './controllers/getLogs'
import { getSettingsController, setSettingsController } from './controllers/settings'
import { showcaseController } from './controllers/showcase'

const app = express()

app.use(bodyParser.json())
app.use(cors())


// Status endpoint that checks the last action by Penny via the logs database
app.get('/penny-status', pennyStatusController)

// Endpoint for the UI showcase page
app.get('/showcase', showcaseController)

// Dump all logs from the database
app.get('/logs', getLogsController)

// Settings
app.get('/settings', getSettingsController)
app.put('/settings', setSettingsController)


// Income target endpoints
// TODO Am I ever going to use this again?
//app.get('/income-targets', getIncomeTargetsController)
//app.post('/income-targets', createIncomeTargetController)


export default app
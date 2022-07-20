import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as fileUpload from 'express-fileupload'

import { pennyStatusController } from './controllers/pennyStatus'
import { getLogsController } from './controllers/getLogs'
import { getSettingsController, setSettingsController } from './controllers/settings'
import { showcaseController } from './controllers/showcase'
import { showcaseRNSController } from './controllers/showcaseRNS'
import { getCronTimesController } from './controllers/getCronTimes'
import { nukeController } from './controllers/nukeController'
import { sellPositionsController } from './controllers/sellPositionsController'
import { uploadCSVController } from './controllers/uploadCSV'


const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload({
  createParentPath: true
}))


// Status endpoint that checks the last action by Penny via the logs database
app.get('/penny-status', pennyStatusController)

// Endpoint for the UI showcase page
app.get('/showcase', showcaseController)

// Endpoint for the new UI showcase page
app.get('/showcase-rns', showcaseRNSController)

// Dump all logs from the database
app.get('/logs', getLogsController)

// Get the latest cron run times
app.get('/cron-times', getCronTimesController)

// Settings
app.get('/settings', getSettingsController)
app.put('/settings', setSettingsController)

// Nuke
app.post('/nuke', nukeController)

// Sell positions
app.post('/sell-positions', sellPositionsController)



// Upload CSV
app.post('/upload-csv', uploadCSVController)


// Income target endpoints
// TODO Am I ever going to use this again?
//app.get('/income-targets', getIncomeTargetsController)
//app.post('/income-targets', createIncomeTargetController)


export default app
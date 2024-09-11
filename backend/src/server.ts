import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import indexRoutes from './handlers/index_routes';

const cors = require('cors')
const path = require('path');

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

app.use(bodyParser.json())
app.use(cors())

app.get('/', function (req: Request, res: Response) {
    res.send('Hello App!')
})

indexRoutes(app)

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})


/**
 * Created by lerayne on 09.05.17.
 */

import 'babel-polyfill'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
//local
import isomorphicRender from './server/isomorphicRender'

// create app
const app = express()

// parsing incoming data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())

app.use('*', isomorphicRender)

const PORT = process.env.PORT || 3002

//launch server
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})
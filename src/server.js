/**
 * Created by lerayne on 09.05.17.
 */

import 'babel-polyfill'
import 'isomorphic-fetch'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
//local
import createStaticPage from './server/createStaticPage'

// create app
const app = express()

// parsing incoming data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
    app.use('/public', express.static('public'))
    app.use('/favicon.ico', express.static('public/favicon.ico'))
}

/*app.post('/login', (req, res) => {
    console.log(req.body)
})*/

app.get('*', createStaticPage)

const PORT = process.env.PORT || 3002

//launch server
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})
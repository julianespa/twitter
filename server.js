const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const webpack = require('webpack')
const config = require('./webpack.config')
const mongoose  = require('mongoose')
const configuration = require('./serverConfig.js')
const vhost = require('vhost')
const api = require('./api/api')
const dotenv = require('dotenv').config();

const app = express()

const compiler = webpack(config)

const connectString = configuration.mongodb.connectionString

const startServer = () => {

    console.log('==> ENV ',process.env.NODE_ENV)

    mongoose.set('strictQuery', false)
    mongoose.connect(connectString, {useNewUrlParser:true,useUnifiedTopology:true}, (err)=>{
        if (err) throw err
        console.log('==> Connected to MongoDB')
    })
    
    app.use('*', require('cors')())
    
    app.use('/public', express.static(__dirname + '/public'))
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json({limit: '10mb'}))
    
    if(process.env.NODE_ENV !== 'production') {
        app.use(require('webpack-dev-middleware')(compiler, {publicPath: config.output.publicPath}))
    }

    app.use(vhost('api.mini-twitter.onrender.com', api))
    
    app.get('/*',(req,res)=>{
        res.sendFile(path.join(__dirname, 'index.html'))
    })
    
    app.listen(configuration.server.port, ()=>{
        console.log(`Example listening on port ${configuration.server.port}` )
    })
}

if(require.main === module) {
    startServer()
} else {
    module.exports = startServer
}

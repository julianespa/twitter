const express = require('express')
const pug = require('pug')
const jwt = require('jsonwebtoken')
const configuration = require('../serverConfig')
const userController = require('../api/controllers/UserController')

const router = express.Router()

router.use('/', (req,res,next)=>{
    let token = req.headers['authorization']
    if(!token){
        next()
        req.user = null
        return
    }

    token = token.replace('Bearer ','')
    jwt.verify(token, configuration.jwt.secret, (err, user)=> {
        if(err){
            req.user = null
            next()
        } else {
            req.user = user
            next()
        }
    })
})

router.use('/secure', (req,res,next)=>{
    if(req.user === null){
        res.status(401).send({
            ok: false,
            message: 'Invalid token'
        })
        return
    }
    next()
})

router.get('/', (req,res)=>{
    res.send(pug.renderFile(__dirname + '/../public/apidoc/api-index.pug'))
})

router.get('/usernameValidate/:username', userController.usernameValidate)
router.post('/signup', userController.signup)

router.get('/*', (req,res,err)=>{
    res.status(400).send({message: 'Invalid service'})
})

module.exports = router
const express = require('express')
const pug = require('pug')
const jwt = require('jsonwebtoken')
const configuration = require('../serverConfig')
const userController = require('../api/controllers/UserController')
const tweetController = require('../api/controllers/TweetController')
const {userValidationRules, userValidate} = require('./validators/userValidator')
const {profileValidationRules, profileValidate} = require('./validators/profileValidator')
const { tweetValidationRules, tweetValidate} = require('./validators/tweetsValidator')

const methodCatalog = require('../public/apidoc/meta/catalog.js')

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

router.get('/catalog', (req,res) => {
    const meta = require('../public/apidoc/meta/catalog.js')
    res.send(pug.renderFile(__dirname + '/../public/apidoc/api-catalog.pug', meta))
})

router.get('/catalog/:method',(req, res)=>{
    let method = req.params.method
    const index = methodCatalog.services.map(x => {return x.apiURLPage}).indexOf('/catalog/'+req.params.method)
    if(index === -1){
      res.send(pug.renderFile(__dirname + '/../public/apidoc/api-index.pug'))
    }else{
      const meta = methodCatalog.services[index]
      res.send(pug.renderFile(__dirname + '/../public/apidoc/api-method.pug', meta))
    }
  })

// Public access services
router.get('/usernameValidate/:username', userController.usernameValidate)
router.post('/signup', userValidationRules(), userValidate, userController.signup)
router.post('/login', userController.login)
router.get('/tweets', tweetController.getNewTweets)
router.get('/profile/:user', userController.getProfileByUsername)
router.get('/tweets/:user', tweetController.getUserTweets)
router.get('/followings/:user', userController.getFollowing)
router.get('/followers/:user', userController.getFollower)
router.get('/tweetDetails/:tweet', tweetController.getTweetDetails)

// Private access services
router.get('/secure/relogin', userController.relogin)
router.get('/secure/suggestedUsers', userController.getSuggestedUser)
router.put('/secure/profile', profileValidationRules(), profileValidate, userController.updateProfile)
router.post('/secure/follow', userController.follow)
router.post('/secure/tweet', tweetValidationRules(), tweetValidate, tweetController.addTweet)
router.post('/secure/like', tweetController.like)

router.get('/*', (req,res,err)=>{
    res.status(400).send({message: 'Invalid service'})
})

module.exports = router
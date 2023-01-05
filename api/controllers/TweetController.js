const Profile = require('../models/Profile')
const Tweet = require('../models/Tweet')
const mongoose = require('mongoose')

const getNewTweets = async (req,res,err) => {
    let user = req.user || {}
    let page = req.query.page
    let perPage = 10

    try {
        let tweets = await Tweet.find({tweetParent: null})
            .populate('_creator', {banner: 0})
            .sort({'_id': -1})
            .limit(10)
            .skip(perPage * page)

        //console.log(tweets)

        let response = tweets.map(x =>{
            return {
                _id: x._id,
                _creator: {
                    _id: x._creator._id,
                    name: x._creator.name,
                    userName: x._creator.userName,
                    avatar: x._creator.avatar || './public/resources/avatars/0.png'
                },
                date: x.date,
                message: x.message,
                liked: x.likeRef.find( likeUser => likeUser.toString() === user.id) || null,
                likeCounter: x.likeRef.length,
                replys: x.replys,
                image: x.image
            }
        })

        console.log(response)

        res.send({
            ok: true,
            body: response
        })

    } catch (error) {
        res.send({
            ok: false,
            message: 'Loading tweets error',
            error: error
        })
    }
}

const getUserTweets = async (req,res,err) => {
    let username = req.params.user
    let page = req.query.page
    let perPage = 10

    try {
        let user = await Profile.findOne({userName: username})

        if(user == null) throw new Error('User does not exist')

        let tweets = await Tweet.find({_creator: user._id, tweetParent: null})
            .populate('_creator')
            .sort({'_id': -1})
            .limit(10)
            .skip(perPage * page)
        
        let response = tweets.map(x => {
            return {
                _id: x._id,
                _creator: {
                    _id: x._creator._id,
                    name: x._creator.name,
                    userName: x._creator.userName,
                    avatar: x._creator.avatar || '/public/resources/avatars/0.png'
                },
                date: x.date,
                message: x.message,
                liked: x.likeRef.find(likeUser => likeUser.toString() === user._id) || null,
                likeCounter: x.likeRef.length,
                replys: x.replys,
                image: x.image
            }
        })

        res.send({
            ok: true,
            body: response
        })
    } catch (error) {
        res.send({
            ok: false,
            message: error.message || 'Error retrieving user tweets',
            error: err
        })
    }
}

const addTweet = (req,res,err) => {
    if(req.body.tweetParent){
        createReplyTweet(req,res,err)
    } else {
        createNewTweet(req,res,err)
    }
}

const createNewTweet = async (req,res,err) => {
    console.log('create new tweet =>')
    let user = req.user

    let session
    try {
        session = await mongoose.startSession()
        session.startTransaction()

        let newTweet = new Tweet({
            _creator: user.id,
            tweetParent: req.body.tweetParent,
            message: req.body.message,
            image: req.body.image
        })

        let updateProfile = await Profile.updateOne({_id: user.id}, {$inc: {tweetCount: 1}}, {session})

        console.log(updateProfile)

        if((!updateProfile.acknowledged) || updateProfile.modifiedCount == 0) throw new Error('User does not exist')

        newTweet = await newTweet.save({session})

        res.send({
            ok: true,
            tweet: newTweet
        })

        session.commitTransaction()

    } catch (error) {
        console.log('error =>', error.message)
        session.abortTransaction()
        res.send({
            ok:false,
            message: error.message || 'Error saving tweet',
            error: error.error || err
        })
    }
}

const createReplyTweet = async (req,res,err) => {
    let user = req.user

    let session
    try {
        session = await mongoose.startSession()
        session.startTransaction()

        let newTweet = new Tweet({
            _creator: user.id,
            tweetParent: req.body.tweetParent,
            message: req.body.message,
            image: req.body.image
        })
        
        let updatedTweet = await Tweet.updateOne({_id: req.body.tweetParent}, {$inc: {replys:1}}).session(session)

        if((!updateProfile.acknowledged) || updateProfile.modifiedCount == 0) throw new Error('parent tweet do not exist')

        newTweet = await newTweet.save({session})
        res.send({
            ok: true,
            tweet: newTweet
        })

        session.commitTransaction()
    } catch (error) {
        session.abortTransaction()
        res.send({
            ok: false,
            message: error.message || 'saving tweet error',
            error: err
        })
    }
}

module.exports = {
    getNewTweets,
    getUserTweets,
    addTweet
}
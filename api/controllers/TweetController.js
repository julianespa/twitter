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

        if((!updatedTweet.acknowledged) || updatedTweet.modifiedCount == 0) throw new Error('parent tweet do not exist')

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

const like = async (req,res,err) => {
    let user = req.user

    try {
        let updateStatement = req.body.like ? { $push: {likeRef: mongoose.Types.ObjectId(user.id)}} : { $pull: {likeRef: mongoose.Types.ObjectId(user.id)}}
        
        let tweet = await Tweet.findOneAndUpdate({_id: req.body.tweetID}, updateStatement)

        if(tweet == null) throw new Error('Tweet does not exist')

        res.send({
            ok: true,
            body: {
                _creator: tweet._creator,
                tweetParent: tweet.tweetParent,
                date: tweet.date,
                message: tweet.message,
                likeRef: tweet.likeRef,
                image: tweet.image,
                replys: tweet.replys,
                likeCounter: tweet.likeRef.length += req.body.like ? 1 : -1
            }
        })
    } catch (error) {
        console.error(error.message)
        res.send({
            ok: false,
            message: error.message || 'updating tweet error',
            error: error.error
        })
    }
}

const getTweetDetails = async (req,res,err) => {
    let user = req.user || {}

    try {
        let tweetId = req.params.tweet
        if(!mongoose.Types.ObjectId.isValid(tweetId)) throw new Error('Invalid tweet ID')

        let tweet = await Tweet.findOne({_id: tweetId}).populate("_creator")
        if(tweet == null) throw new Error('Tweet does not exist')

        let tweets = await Tweet.find({ tweetParent: mongoose.Types.ObjectId(tweetId)}).populate('_creator').sort('-date')

        tweets = tweets || []

        let replys = tweets.map(x => {
            return {
                _id: x._id,
                _creator: {
                    _id: x._creator._id,
                    name: x._creator.name,
                    userName: x._creator.userName,
                    avatar: x._creator.avatar || '/public/resources/avatars/0.png'
                },
                date: x.date,
                message:x.message,
                liked: x.likeRef.find( likeUser => likeUser.toString() == user.id) ||  null,
                likeCounter: x.likeRef.length,
                replys: x.replys,
                image: x.image
            }
        })

        res.send({
            ok: true,
            body: {
                _id: tweet._id,
                _creator: {
                    _id: tweet._creator._id,
                    name: tweet._creator.name,
                    userName: tweet._creator.userName,
                    avatar: tweet._creator.avatar || '/public/resources/avatars/0.png'
                },
                date: tweet.date,
                message: tweet.message,
                liked: tweet.likeRef.find( likeUser => likeUser.toString() == user.id) ||  null,
                likeCounter: tweet.likeRef.length,
                image: tweet.image,
                replys: tweet.replys,
                replysTweets: replys
            }
        })
    } catch (error) {
        res.send({
            ok: false,
            message: error.message || 'Loading tweet error',
            error: error
        })
    }
}

module.exports = {
    getNewTweets,
    getUserTweets,
    addTweet,
    like,
    getTweetDetails
}
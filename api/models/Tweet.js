const mongoose = require('mongoose')

const tweetsCollection = 'Tweet'

const tweetSchema = new mongoose.Schema({
    _creator: {type: mongoose.Types.ObjectId, ref: 'Profile'},
    tweetParent: {type: mongoose.Types.ObjectId, ref: 'Tweet'},
    date: {type: Date, default: Date.now},
    message: String,
    likeRef: [{type: mongoose.Types.ObjectId, ref: 'Profile', default: []}],
    image: {type: String},
    replys: {type: Number, default: 0}
})

// Virtual fields
tweetSchema.virtual('likeCounter').get(()=>{
    return this.likeRef.length
})

const Tweet = mongoose.model(tweetsCollection, tweetSchema)

module.exports = Tweet

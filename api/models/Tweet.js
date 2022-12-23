import mongoose, { Schema, SchemaTypeOptions } from "mongoose";

const tweetsCollection = 'Tweet'

const tweetSchema = new mongoose.Schema({
    _creator: {type: Schema.Types.ObjectId, ref: 'Profile'},
    tweetParent: {type: Schema.Types.ObjectId, ref: 'Tweet'},
    date: {type: Date, default: Date.now},
    message: String,
    likeRef: [{type: Schema.Types.ObjectId, ref: 'Profile', default: []}],
    image: {type: String},
    replys: {type: Number, default: 0}
})

// Virtual fields
tweetSchema.virtual('likeCounter').get(()=>{
    return this.likeRef.length
})

export const Tweet = mongoose.model(tweetsCollection, tweetSchema)

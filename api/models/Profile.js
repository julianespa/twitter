import mongoose, { Schema } from "mongoose";
import uniqueValidator from 'mongoose-unique-validator'
import { Tweet } from "./Tweet";

const profileCollection = 'Profile'

const profileSchema = new mongoose.Schema({
    name: {type: String},
    userName: {type: String, unique: true, index: true, uniqueCaseInsensitive: true},
    password: {type: String},
    description: {type: String, default: 'New in Twitter'},
    avatar: {type: String, default: null},
    banner: {type: String, default: null},
    tweetCount: {type: Number, default: 0},
    followingRef: [{type: Schema.Types.ObjectId, ref: 'Profile', default: []}],
    followersRef: [{type: Schema.Types.ObjectId, ref: 'Profile', default: []}],
    date: {type: Date, default: Date.now},
})

//Unique plugin validate
profileSchema.plugin(uniqueValidator, {message: 'The {PATH} to be unique.'})

//Helpers
profileSchema.query.byUsername = (userName) => {
    return this.find({userName: userName})
}

//virtual Fields
profileSchema.virtual('following').get(()=>{
    return this.followingRef.length
})

profileSchema.virtual('followers').get(()=>{
    return this.followersRef.length
})

export const Profile = mongoose.model(profileCollection, profileSchema)
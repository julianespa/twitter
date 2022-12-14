const Profile = require('../models/Profile')
const bcrypt = require('bcrypt')
const { generateToken } = require('../services/AuthService')
const jwt = require('jsonwebtoken')
const configuration = require('../../serverConfig')
const { default: mongoose } = require('mongoose')

const usernameValidate = async (req, res, err) => {
    try {
        let profiles = await Profile.find({userName: req.params.username.toLowerCase()})

        if (profiles.length > 0) throw new Error('User already exist')

        res.send({
            ok: true,
            message: 'User available'
        })
    } catch (err) {
        res.send({
            ok: false,
            message: err.message || 'Validating username error'
        })
    }
}

const signup = async (req,res,err) => {
    try {
        let newProfile = new Profile({
            name: req.body.name,
            userName: req.body.username.toLowerCase(),
            password: bcrypt.hashSync(req.body.password, 10)
        })

        newProfile = await newProfile.save()

        res.send({
            ok: true,
            body: {
                profile: newProfile
            }
        })

    } catch (err) {
        let errorMessage = null
        if (err.errors != null && err.errors.userName != null) {
            errorMessage = 'Username unavailable'
        } else {
            errorMessage = 'Error saving new user'
        }

        res.send({
            ok: false,
            message: 'error creating user',
            error: errorMessage
        })
    }
}

const login = async (req,res,err) => {
    try {
        let profile = await Profile.findOne({userName: req.body.username.toLowerCase()})
        if(profile == null) throw new Error('Invalid user or password')

        let valid = await bcrypt.compare(req.body.password, profile.password)
        if(!valid) throw new Error('Invalid user or password')

        let user = {
            username: req.body.username,
            id: profile._id
        }

        let token = generateToken(user)

        res.send({
            ok: true,
            profile: {
                id: profile._id,
                name: profile.name,
                userName: profile.userName,
                avatar: profile.avatar || '/public/resources/avatars/0.png',
                banner: profile.banner || '/public/resources/banners/4.png',
                tweetCount: profile.tweetCount,
                following: profile.followingRef.length,
                followers: profile.followersRef.length
            },
            token: token
        })

    } catch (err) {
        res.send({
            ok: false,
            message: err.message || 'Validating user error'
        })
    }
}

const relogin = async (req,res,err) => {
    try {
        let userToken = {
            id: req.user.id,
            username: req.user.username
        }
        let newToken = generateToken(userToken)

        let profile = await Profile.findOne({_id: req.user.id})
        if(profile == null) throw new Error('user does not exist')

        res.send({
            ok: true,
            profile: {
                id: profile._id,
                name: profile.name,
                userName: profile.userName,
                avatar: profile.avatar || '/public/resources/avatars/0.png',
                banner: profile.banner || '/public/resources/banners/4.png',
                tweetCount: profile.tweetCount,
                following: profile.followingRef.length,
                followers: profile.followersRef.length
            },
            token: newToken
        })
    } catch (error) {
        res.send({
            ok: false,
            message: error.message || 'Validating user error'
        })
    }
}

const getSuggestedUser = async (req,res,err) => {
    let user = req.user

    try {
        let users = await Profile.find({userName: {$ne: user.username}})
            .sort({'date': -1})
            .limit(6)

        res.send({
            ok: true,
            body: users.map(x => {
                return {
                    _id: x._id,
                    name: x.name,
                    description: x.description,
                    userName: x.userName,
                    avatar: x.avatar || '/public/resources/avatars/0.png',
                    banner: x.banner || '/public/resources/banners/4.png',
                    tweetCount: x.tweetCount,
                    following: x.followingRef.length,
                    followers: x.followersRef.length
                }
            })
        })
    } catch (error) {
        res.send({
            ok:false,
            message: error.message || 'Validating user error'
        })
    }
}

const getProfileByUsername = async (req,res,err) => {
    let user = req.params.user

    try {
        if(user == null) throw new Error('User param required')

        let profile = await Profile.findOne({userName: user})

        if(profile == null) throw new Error('User do not exist')

        let token = req.headers['authorization'] || ''
        token.replace('Bearer ','')

        let userToken = await jwt.verify(token, configuration.jwt.secret)

        let follow = profile.followersRef
            .find(x => x.toString() === userToken.id.toString()) != null

        res.send({
            ok:true,
            body: {
                _id: profile._id,
                name: profile.name,
                description: profile.description,
                userName: profile.userName,
                avatar: profile.avatar || '/public/resources/avatars/0.png',
                banner: profile.banner || '/public/resources/banners/4.png',
                tweetCount: profile.tweetCount,
                following: profile.followingRef.length,
                followers: profile.followersRef.length,
                follow: follow 
            }
        })
    } catch (error) {
        res.send({
            ok: false,
            message: error.message || 'User param required'
        })
    }
}

const updateProfile = async (req,res,err) => {
    let username = req.user.username

    try {
        const updates = {
            name: req.body.name,
            description: req.body.description,
            avatar: req.body.avatar,
            banner: req.body.banner
        }

        let response = await Profile.updateOne({userName: username}, updates)
        res.send({
            ok: true
        })
    } catch (error) {
        res.send({
            ok: false,
            message: error.message || 'Error updating user profile'
        })
    }
} 

const getFollowing = async (req,res,err) => {
    let username = req.params.user

    try {
        let followings = await Profile.findOne({userName: username})
            .populate('followingRef')
        
        if(followings == null) throw new Error('User does not exist')

        let response = followings.followingRef.map(x => {
            return {
                _id: x._id,
                userName: x.userName,
                name: x.name,
                description: x.description,
                avatar: x.avatar || '/public/resources/avatars/0.png',
                banner: x.banner || '/public/resources/banners/4.png'
            }
        })

        res.send({
            ok: true,
            body: response
        })
    } catch (error) {
        res.send({
            ok: false,
            message: error.message || 'Get followings error'
        })
    }
}

const getFollower = async (req,res,err) => {
    let username = req.params.user

    try {
        let followers = await Profile.findOne({userName: username})
            .populate('followersRef')
        
        if(followers == null) throw new Error('User does not exist')

        let response = followers.followersRef.map(x => {
            return {
                _id: x._id,
                userName: x.userName,
                name: x.name,
                description: x.description,
                avatar: x.avatar || '/public/resources/avatars/0.png',
                banner: x.banner || '/public/resources/banners/4.png'
            }
        })

        res.send({
            ok: true,
            body: response
        })
    } catch (error) {
        res.send({
            ok: false,
            message: error.message || 'Get followers error'
        })
    }
}

const follow = async (req,res,err) => {
    let username = req.user.username
    let followingUser = req.body.followingUser
    let session

    try {
        session = await mongoose.startSession()
        session.startTransaction()

        let users = await Profile.find({userName: {$in: [username, followingUser]}})

        if(users.length != 2) throw new Error('user does not exist')
        let my = users.find(x => x.userName == username)
        let other = users.find(x => x.userName == followingUser)

        let following = my.followingRef.find(x => x.toString() == other._id.toString()) != null

        let myUpdate = null
        let otherUpdate = null

        if(following) {
            myUpdate = { $pull: {followingRef: other._id}}
            otherUpdate = { $pull: {followersRef: my._id}}
        } else {
            myUpdate = { $push: {followingRef: other._id}}
            otherUpdate = { $push: {followersRef: my._id}}
        }

        let myUp = await Profile.updateOne({userName: my.userName}, myUpdate, {session})
        let otherUp = await Profile.updateOne({userName: other.userName}, otherUpdate, {session})

        res.send({
            ok: true,
            unfollow: following
        })

        session.commitTransaction()

    } catch (error) {
        console.log('error =>', error.message)
        session.abortTransaction()
        res.send({
            ok: false,
            message: error.message || 'Operation error'
        })
    }
}

module.exports = {
    usernameValidate,
    signup,
    login,
    relogin,
    getSuggestedUser,
    getProfileByUsername,
    updateProfile,
    getFollowing,
    getFollower,
    follow
}
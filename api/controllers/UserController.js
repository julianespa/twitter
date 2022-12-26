const Profile = require('../models/Profile')
const bcrypt = require('bcrypt')

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

module.exports = {
    usernameValidate,
    signup
}
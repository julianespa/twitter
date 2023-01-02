var jwt = require('jsonwebtoken')
var configuration = require('../../serverConfig')

const generateToken = (user) => {
    let u = {
        username: user.username,
        id: user.id
    }

    return token = jwt.sign(u, configuration.jwt.secret, {
        expiresIn: 60 * 60 * 24 // 24 hr
    })
}

module.exports = {
    generateToken
}
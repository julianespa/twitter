const {body, validationResult} = require('express-validator')

const tweetValidationRules = () => {
    return [
        body('message').isLength({min: 1}).withMessage('Message too short, minimum 1 character'),
        body('message').isLength({max: 140}).withMessage('Message too long, maximum 140 characters'),
        body('image').custom(image => {
            if(!image) return true
            let result = 4 * Math.ceil((image.length / 3))
            if((result / 1000) > 1024) throw new Error('Image too big')
            return true
        })
    ]
}

const tweetValidate = (req,res,next) => {
    const errors = validationResult(req)
    if(errors.isEmpty()) {
        return next()
    }

    const extractedErrors = errors.array().map( err => {return { [err.param]: err.msg }})

    return res.status(422).json({
        ok: false,
        errors: extractedErrors
    })
}

module.exports = {
    tweetValidationRules,
    tweetValidate
}
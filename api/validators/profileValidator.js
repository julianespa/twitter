const {body, validationResult} = require('express-validator')

const profileValidationRules = () => {
    return [
        body('description').isLength({max: 180}).withMessage('Description too long, maximum 180 characters'),
        body('name').isLength({min: 4}).withMessage('Name too short, minimum 4 characters'),
        body('name').isLength({max: 20}).withMessage('Name too long, maximum 20 characters'),
        body('banner').isLength({min: 1}).withMessage('banner is required'),
        body('banner').custom(banner => {
            if(!banner) return true
            let result = 4 * Math.ceil((banner.length / 3))
            if((result / 1000) > 1024) throw new Error('banner too big')
            return true
        }),
        body('avatar').isLength({min: 1}).withMessage('avatar is required'),
        body('avatar').custom(banner => {
            if(!banner) return true
            let result = 4 * Math.ceil((banner.length / 3))
            if((result / 1000) > 1024) throw new Error('avatar too big')
            return true
        })
    ]
}

const profileValidate = (req, res, next) => {
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next()
    }

    const extractedErrors = errors.array().map( err => {return { [err.param]: err.msg }})

    return res.status(422).json({
        ok: false,
        errors: extractedErrors
    })
}

module.exports = {
    profileValidationRules,
    profileValidate
}
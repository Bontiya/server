module.exports = function (err, req, res, next) {  
    // console.log(err, 'error handler')
    let status = 500
    let msg = ['internal server error']

    if (err.name === 'ValidationError') {
        const result =  err.errors
        const errors = []
        for (const key in result) {
            if (result.hasOwnProperty(key)) {
                errors.push(result[key].message)
            }
        }
        status = 422
        msg = errors
    }else if (err.name === 'MongoError') {
        const errors = []
        for (const key in err.keyValue) {
            if (err.keyValue.hasOwnProperty(key)) {
                errors.push(`${key} has been used`)
            }
        }
        status = 409
        msg = errors
    }
    console.log(msg)
    res.status(status).json({
        errors: msg
    })
}

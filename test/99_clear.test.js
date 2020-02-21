const chai = require('chai');

const User = require('../models/User');

describe('clear', function () {  
    it('clear all', function (done) {  
        User
            .deleteMany({})
            .then((rs) => {
                console.log(rs)
                done()
            })
            .catch(err=> {
                console.log(err)
            })
    })
})
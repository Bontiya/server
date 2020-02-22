const chai = require('chai');

const User = require('../models/User');
const Event = require('../models/Event');
const Member = require('../models/Member');

describe('clear', function () {  
    it('clear all', function (done) {  
        const promiseyArr = [
            User.deleteMany({}),
            Event.deleteMany({}),
            Member.deleteMany({})
        ]
        
        Promise.all(promiseyArr)
            .then(result => {
                console.log(result)
                done()
            })
    })
})
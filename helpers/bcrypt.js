const bcrypt = require('bcrypt');
const saltRounds = 8;

const hashPassword = (password) => {
    /* istanbul ignore next */
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

const checkPassword = (password, hashedPassword) => {
    /* istanbul ignore next */
    return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
    hashPassword,
    checkPassword
}
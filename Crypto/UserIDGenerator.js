const crypto =require('crypto');
const { userInfo } = require('os');

function generateUserID(name, age) {
    const data = `${name}${age}`;
    
     hash = crypto.createHash('sha256');
    hash.update(data);
    const User_ID = hash.digest('hex');
    
    return User_ID;
}

module.exports = generateUserID
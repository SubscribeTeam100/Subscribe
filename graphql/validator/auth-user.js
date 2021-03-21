const jwt = require('jsonwebtoken')
const {KEY} = require('../../config')

function authHeader(context){
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try{
                const user = jwt.verify(token, KEY);
                return user;
            }catch(err){
                throw new Error(err);
            }
        }
        else throw new Error('Token unavailable')
    }
    else throw new Error('No authHeader Provided')
};
module.exports = authHeader;
const   jwt           =   require('jsonwebtoken'),
        userModel   =   require('../Models/user');
const checkAuth =   async(req, res, next) => {
    try{
        const token = req.header('authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'superSecret');

        const user = await userModel.findOne({ _id: decoded.id, 'tokens.token': token});
        if(!user){
            throw new Error('error: please authenticate')
        }
        req.token = token;
        req.user  = user;
    }catch(e){
        return next(new Error(e.message))
    }
    next()
};
module.exports = checkAuth;

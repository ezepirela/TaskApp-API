const userModel     =   require('../Models/user');
const controller = {
    getUsers: async (req, res) => {
        let users;
        try{
         users =  await userModel.find();
        }catch(e){
            res.status(400).send(e);
        }
        res.send(users);
    },
    createUsers: async (req, res) => {
        let newUser;
        let token;
        try{
            newUser = await new userModel(req.body);
            await newUser.save();
            token = await newUser.createAuthToken();
        }catch(e){
            res.status(400).send(e);
        }
        res.status(201).send({newUser, token});
    },
    getProfile: async (req, res, next) => {
        res.send(req.user);
    },
    logout: async (req, res, next) => {
        try {
            req.user.tokens = req.user.tokens.filter(token => {
                return token.token !== req.token
            })
            await req.user.save()
        }catch(e){
            next(new Error('failed to logout'))
        }
        res.send('logout')
    },
    logoutAll: async (req, res, next) => {
        try {
            req.user.tokens =   [{}]
            await req.user.save();
        }catch(e){
            next(new Error('failed to logout'))
        }
        res.send('logout')
    },
    updateUser: async (req, res, next) => {
        let users;
        const updates   =   Object.keys(req.body);
        const allowedUpdates    =   ['name', 'email', 'age', 'password'];
        const isValidOperation    =   updates.every(update => allowedUpdates.includes(update));
        if(!isValidOperation){
            return next(new Error('invalid updates'))
        }
        try {
            updates.forEach(update => req.user[update] = req.body[update]);
            await req.user.save();
        }catch(e){
            return next(new Error(e.message));
        }
        res.status(200).send(req.user);
    },
    deleteUser: async (req, res, next) => {
        try {
            await req.user.remove();
        }catch(e){
            return next(new Error(e.message));
        }
        res.status(200).send('deleted user');
    },
    login: async (req, res, next) => {
        let user
        let token
        try{
            user = await userModel.findByCredentials(req.body.email, req.body.password)
            token = await user.createAuthToken()
        }catch(e){
            return next(new Error(e.message));
        }
        res.status(200).send({user, token});
    }
}
module.exports = controller;
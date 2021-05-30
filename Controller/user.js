const   userModel           =   require('../Models/user'),
        sharp               =   require('sharp'),
        { sendWelcomeEmail, sendFarewellEmail }    =   require('../emails/account');
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
            sendWelcomeEmail(newUser.email, newUser.name);
            await newUser.save();
            token = await newUser.createAuthToken();
        }catch(e){
            return res.status(400).send(e.message);
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
            await sendFarewellEmail(req.user.email, req.user.name);
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
    }, 
    uploadImage: async (req, res, next) => {
        const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
        req.user.avatar = buffer;
        await req.user.save()
        res.send('image take it')
    },
    deleteImage: async (req, res, next) => {
        req.user.avatar = undefined;
        await req.user.save();
        res.send('image removed');
    }, 
    getAvatarImage: async (req, res, next) => {
        try{
            const user = await userModel.findById(req.params.id);
            if(!user || !user.avatar){
                return next(new Error('user not found'))
            }
            res.set('Content-Type', 'image/png')
            res.send(user.avatar);
        }catch(e){
            res.status(404).send(e.message)
        }
    }
}
module.exports = controller;
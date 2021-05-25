const userModel     =   require('../Models/user');
const controller = {
    saludo: async (req, res) => {
        res.send('prueba')
    },
    getUsers: async (req, res) => {
        let users;
        try{
         users =  await userModel.find();
        }catch(e){
            res.status(400).send(e);
        }
        res.send(users);
    },
    getUsersById: async (req, res) => {
        let users;
        try{
         users =  await userModel.findById(req.params.id);
        }catch(e){
            res.status(400).send(e);
        }
        res.send(users);
    },
    createUsers: async (req, res) => {
        let newUser;
        try{
            newUser = await new userModel(req.body);
            await newUser.save();
        }catch(e){
            res.status(400).send(e);
        }
        res.status(201).send(newUser);
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
            users = await userModel.findById(req.params.id);
            updates.forEach(update => users[update] = req.body[update]);
            await users.save();
            if(!users){
                return next(new Error('no user found'));
            }
        }catch(e){
            return next(new Error(e.message));
        }
        res.status(200).send(users);
    },
    deleteUser: async (req, res, next) => {
        let user;
        try {
            user =   await userModel.findByIdAndDelete(req.params.id);
            if(!user){
                return next(new Error('cannot find user'));
            }
        }catch(e){
            return next(new Error(e.message));
        }
        res.status(200).send('deleted user');
    }
}
module.exports = controller;
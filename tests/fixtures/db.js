const   mongoose    =   require('mongoose'),
        jwt         =   require('jsonwebtoken'),
        userModel   =   require('../../Models/user'),
        tasksModel  =   require('../../Models/tasks');

const userObjectId  =   new mongoose.Types.ObjectId();
const newUser = {
    _id: userObjectId,
    name: 'ezequiel 2',
    email: 'ezepirela@test.com',
    password: "12345678",
    age: 23,
    tokens: [{
        token: jwt.sign({id: userObjectId.toString()}, process.env.JWT_KEY)
    }]
}
const setUpDatabase = async () => {
    await userModel.deleteMany();
    await new userModel(newUser).save();
}
module.exports = {
    setUpDatabase,
    newUser
}
const   mongoose    =   require('mongoose'),
        validator   =   require('validator'),
        bcrypt      =   require('bcryptjs'),
        jwt         =   require('jsonwebtoken'),
        tasksModel  =   require('../Models/tasks');

const userSchema    =   new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    tokens: [{
        token : {
            type: String,
            required: true
        }
    }],
    age: {
        type: Number,
        required: true,
        validate(value){
            if(value < 0){
                throw new Error('age must be positive')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength:  7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('not valid password')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is not valid')
            }
        }
    }
});
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'creator'
})
userSchema.methods.toJSON = function(){
    // cuando se llamada res.send(user), express automaticamente lo que ejecuta es res.send(JSONstringify(user))
    // y JSONstringify es lo mismo a llamar this.toJSON el cual es el metodo que estamos definiendo aca
    // dentro de este metodo definimos que es lo que queremos regresar en el user con el return y eliminando las propiedades

    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject
}
userSchema.methods.createAuthToken  =   async function(){
    const token =   jwt.sign({id: this._id.toString()}, 'superSecret');
    this.tokens = this.tokens.concat({token});
    await this.save();
    return token
}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await userModel.findOne({email});
    if(!user){
        throw new Error('unable to login');
    }
    const isMatch  = await  bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('unable to login');
    }
    return user
}
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8);
    }
    next()
})
userSchema.pre('remove', async function(next){
    await tasksModel.deleteMany({creator: this._id});
    next();
})
const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
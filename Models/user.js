const   mongoose    =   require('mongoose'),
        validator   =   require('validator'),
        bcrypt      =   require('bcryptjs');

const userSchema    =   new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
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
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is not valid')
            }
        }
    }
})
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8);
    }
    next()
})
const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
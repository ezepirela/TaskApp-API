const mongoose  =   require('mongoose');
const taskSchema    =   new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});
const tasksModel = mongoose.model('Task', taskSchema);
module.exports = tasksModel;
const tasksModel    =   require('../Models/tasks');

const controller    =   {
    getTasks : async (req, res) => {
        let tasks;
        await req.user.populate('tasks').execPopulate();
        console.log(req.user.tasks)
        try{
            tasks   =   await req.user.tasks;
        }catch(e){
            res.status(400).send(e);
            return
        }
        res.send(tasks);
    },
    getTasksById: async (req, res) => {
        const _id = req.params.id
        let tasks;
        try{
            tasks =  await tasksModel.findOne({_id, creator: req.user._id});
            if(!tasks){
                res.status(404).send('error, tasks does not exist');
            }
        }catch(e){
            res.status(500).send(e);
        }
        res.send(tasks);
    },
    createTasks : async (req, res) => {
        let newTask;
        try {
            newTask = await new tasksModel({
                ...req.body,
                creator: req.user._id
            });
            await newTask.save();
        }catch(e){
            res.status(400).send(e);
            return
        }
        res.status(201).send(newTask);
    },
    updateTasks: async (req, res, next) =>{
        let task;
        const updates   =   Object.keys(req.body);
        const allowedUpdates    =   ['description', 'completed'];
        const isValidOperation    =   updates.every(update => allowedUpdates.includes(update));
        if(!isValidOperation){
            return next(new Error('invalid updates'))
        }
        try {

            task = await tasksModel.findById(req.params.id);
            updates.forEach(update => task[update] = req.body[update]);
            await task.save();
            if(!task){
                return next(new Error('no task found'));
            }
        }catch(e){
            return next(new Error(e.message));
        }
        res.status(200).send(task);
    },
    deleteTasks: async (req, res, next) => {
        let task;
        try {
            task =   await tasksModel.findByIdAndDelete(req.params.id);
            if(!task){
                return next(new Error('cannot find task'));
            }
        }catch(e){
            return next(new Error(e.message));
        }
        res.status(200).send('deleted task');
    }
}
module.exports = controller;
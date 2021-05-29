const tasksModel    =   require('../Models/tasks');

const controller    =   {
    getTasks : async (req, res) => {
        let tasks;
        let match = {};
        let sort = {};
        if(req.query.completed){
            match.completed = req.query.completed === 'true' 
        }
        if(req.query.sortBy){
            splitString = req.query.sortBy.split(':');
            sort[splitString[0]] = splitString[1] === 'desc' ? -1 : 1;
        }
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
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

            task = await tasksModel.findOne({_id: req.params.id, creator: req.user._id});
            if(!task){
                return next(new Error('no task found'));
            }
            updates.forEach(update => task[update] = req.body[update]);
            await task.save();
            
        }catch(e){
            return res.status(404).send(e.message)
        }
        res.status(200).send(task);
    },
    deleteTasks: async (req, res, next) => {
        let task;
        try {
            task =   await tasksModel.findOne({_id: req.params.id, creator: req.user._id});
            if(!task){
                return next(new Error('cannot find task'));
            }
            await task.remove();
        }catch(e){
            return res.status(404).send(e.message);
        }
        res.status(200).send('deleted task');
    }
}
module.exports = controller;
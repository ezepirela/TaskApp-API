const express           =   require('express'),
        router          =   express.Router(),
        tasksController =   require('../Controller/tasks');

// router.get('/', tasksController.getTasks);
// router.post('/', tasksController.createTasks);
router.route('/')
        .get(tasksController.getTasks)
        .post(tasksController.createTasks);
router.route('/:id')
        .get(tasksController.getTasksById)
        .patch(tasksController.updateTasks)
        .delete(tasksController.deleteTasks);
module.exports =   router;
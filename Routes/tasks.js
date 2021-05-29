const express           =   require('express'),
        router          =   express.Router(),
        tasksController =   require('../Controller/tasks'),
        checkAuth       =   require('../middleware/auth');
router.route('/')
        .get(checkAuth, tasksController.getTasks)
        .post(checkAuth, tasksController.createTasks);
router.route('/:id')
        .get(checkAuth, tasksController.getTasksById)
        .patch(checkAuth, tasksController.updateTasks)
        .delete(checkAuth, tasksController.deleteTasks);
module.exports =   router;
const express           =   require('express'),
        router          =   express.Router(),
        tasksController =   require('../Controller/tasks'),
        checkAuth       =   require('../middleware/auth');

// router.get('/', tasksController.getTasks);
// router.post('/', tasksController.createTasks);
router.route('/')
        .get(checkAuth, tasksController.getTasks)
        .post(checkAuth, tasksController.createTasks);
router.route('/:id')
        .get(checkAuth, tasksController.getTasksById)
        .patch(tasksController.updateTasks)
        .delete(tasksController.deleteTasks);
module.exports =   router;
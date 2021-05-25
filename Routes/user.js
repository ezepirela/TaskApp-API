const   express         =   require('express'),
        router          =   express.Router(),
        userController  =   require('../Controller/user');
router.get('/', userController.getUsers);
router.post('/', userController.createUsers);
router.get('/:id', userController.getUsersById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
module.exports = router;
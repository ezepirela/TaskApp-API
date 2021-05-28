const   express         =   require('express'),
        router          =   express.Router(),
        userController  =   require('../Controller/user'),
        checkAuth       =   require('../middleware/auth');

router.route('/')
    .get(userController.getUsers)
    .post(userController.createUsers)
router.get('/myProfile',checkAuth, userController.getProfile)
router.route('/myProfile')
    .patch(checkAuth, userController.updateUser)
router.delete('/myProfile',checkAuth, userController.deleteUser);
router.post('/login', userController.login);
router.post('/logout',checkAuth, userController.logout);
router.post('/logoutAll',checkAuth, userController.logoutAll);
module.exports = router;
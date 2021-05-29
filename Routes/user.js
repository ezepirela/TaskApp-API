const   express         =   require('express'),
        router          =   express.Router(),
        userController  =   require('../Controller/user'),
        checkAuth       =   require('../middleware/auth'),
        multer          =   require('multer');
const upload   =    multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpep|png)$/)){
            return cb(new Error('Please upload a image file with the following extension. PNG, JPEG, JPG'));
        }
        cb(undefined, true);
    }
});
router.route('/')
    .get(userController.getUsers)
    .post(userController.createUsers)
router.route('/myProfile')
    .get(checkAuth, userController.getProfile)
    .patch(checkAuth, userController.updateUser)
    .delete(checkAuth, userController.deleteUser);
router.post('/login', userController.login);
router.post('/logout',checkAuth, userController.logout);
router.post('/logoutAll',checkAuth, userController.logoutAll);
router.post('/uploadImage', checkAuth, upload.single('upload'), userController.uploadImage);
router.delete('/deleteImage', checkAuth, userController.deleteImage);
router.get('/:id/avatarImage', userController.getAvatarImage)
module.exports = router;
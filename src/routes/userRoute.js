const express = require('express');
const userController = require('../controller/userController');
const router = express.Router();

router.post('/upload', userController.multerUploadMiddleWare,
    userController.resizeUserPhoto,
    userController.upload);

router.get('/:id', userController.getById)

module.exports = router;
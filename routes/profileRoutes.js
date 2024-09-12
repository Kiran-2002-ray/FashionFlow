const express = require('express');
const router= express.Router();
const profileControllers= require('../controllers/profileControllers');
const verifyToken = require('../middleware/verifyToken');


router.get('/getProfile',verifyToken,profileControllers.getProfile);
router.post('/saveProfilePic',verifyToken,profileControllers.saveProfilePic)
module.exports= router;

const express = require('express');
const router = express.Router();
const canvasController = require('../controllers/canvasController');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

router.post('/login', authController.login);
router.get('/canvas', canvasController.getCanvas);
router.post('/canvas/add-image', authMiddleware, upload.single('file'), canvasController.addImage);
router.post('/canvas/add-gif', authMiddleware, upload.single('file'), canvasController.addGif);
router.put('/canvas/update', authMiddleware, canvasController.updateCanvas);

module.exports = router;
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const UploadController = require('../controllers/uploadController');
const router = express.Router();

const config = require('../config');
const uploadDir = config.UPLOAD_DIR;
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({
  storage,
  limits: { fileSize: config.MAX_FILE_SIZE },
});

router.post('/', upload.single('file'), UploadController.handleUpload);

module.exports = router;

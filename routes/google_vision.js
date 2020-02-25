'use strict';
const Router = require('express').Router();
const unggah = require('unggah');
const {
  detectAnImage,
} = require('../controllers/GoogleVisionContoller');

// const storage = unggah.gcs({
//   keyFilename: process.env.BUCKET_FILENAME,
//   bucketName: process.env.BUCKET_NAME,
//   rename: (req, file) => {
//     return `bontiya-image${file.originalname}`
//   }
// });

// const upload = unggah({
//   storage: storage,
// });
// Router.post('/upload-image', upload.single('file'), (req, res) => {
//   res.status(200).json(req.body);
// })
Router.post('/detect', detectAnImage);

module.exports = Router;

'use strict';
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const client = new ImageAnnotatorClient({
  keyFilename: process.env.SERVICE_ACCOUNT_KEY,
});

class GoogleVisionController {
  /* istanbul ignore next */
  static async detectAnImage(req, res, next) {
    /* istanbul ignore next */
    try {
      const { data } = req.body
      const response = await client.labelDetection(Buffer.from(data.baseImg, 'base64'));
      const predictions = [];
      response[0].labelAnnotations.forEach((prediction) => {
        predictions.push({
          name: prediction.description,
          score: prediction.score,
        });
      });
      res.status(200).json(predictions);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GoogleVisionController;

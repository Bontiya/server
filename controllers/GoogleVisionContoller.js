'use strict';
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const client = new ImageAnnotatorClient({
  keyFilename: process.env.SERVICE_ACCOUNT_KEY,
});

class GoogleVisionController {
  static async detectAnImage(req, res, next) {
    try {
      const { imageurl } = req.query;
      const response = await client.labelDetection(imageurl);
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

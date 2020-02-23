'use strict';
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const client = new ImageAnnotatorClient({
  keyFilename: process.env.SERVICE_ACCOUNT_KEY,
});

class GoogleVisionController {
  static async detectAnImage(req, res, next) {
    try {
      // const response = await client.labelDetection('https://cdn.mos.cms.futurecdn.net/v5s9y4v4hM9P8tA6tdF3N4.jpg');
    } catch (error) {
      next(error);
    }
  }
}

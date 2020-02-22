'use strict';
const axios = require('axios');
// const client = require('../elasticsearch');
const { Client } = require('elasticsearch');
const client = new Client({
  host: 'http://localhost:9200'
});


class LocationContrller {
  static async queryLocation(req, res, next) {
    try {
      const { q, lat, lon } = req.query;
      const body = {
        size: 200,
        from: 0,
        query: {
          match: {
            name: q,
          },
        },
      };
      const hits = await client.search({
          index: 'place-suggestions',
          body: body,
          type: 'location-list' 
        })
      if (hits.hits.hits.length < 1) {
        const place_prediction = [];
        const { data }  = await axios({
          method: 'GET',
          url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${q}&types=establishment&key=${process.env.GOOGLE_MAP_KEY}&radius=500&limit=10&location=${lat},${lon}`
        })
        for (let i = 0; i < data.predictions.length; i++) {
          const detail = {
            id: data.predictions[i].place_id,
            name: data.predictions[i].structured_formatting.main_text,
            description: data.predictions[i].description
          };
          place_prediction.push(detail);
        }
        res.status(200).json(place_prediction);
      } else {
        res.status(200).json(hits.hits.hits[0]._source)
      }
    } catch (err) {
      next(err);
    }
  }
  static async getLocationDetail(req, res, next) {
    try {
      // check di elasticsearch udah ada ato belum.
      const { placeid } = req.query;
      const body = {
        size: 200,
        from: 0,
        query: {
          match: {
            id: placeid,
          },
        },
      };
      const hits = await client.search({
          index: 'place-suggestions',
          body: body,
          type: 'location-list',
        })
      if (hits.hits.hits.length < 1) {
        console.log('masuk ini')
        const { data } = await axios({
          method: 'GET',
          url: `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_MAP_KEY}&place_id=${placeid}&fields=address_component,name,vicinity,geometry`
        })
        // place detail disimpan ke elasticsearch
        const placeDetail = {
          id: placeid,
          name: data.result.name,
          description: data.result.vicinity,
          lat: data.result.geometry.location.lat,
          lon: data.result.geometry.location.lng
        };
        // hello
        client.bulk({
          body: [
            {
              index: {
                _index:"place-suggestions", 
                _type:"location-list",}
            },
            placeDetail
          ]
        }, function (err, response) {
          if (err) console.log(err, 'err')
          else console.log(response)
        })
        res.status(200).json(placeDetail);
      } else {
        res.status(200).json(hits.hits.hits[0]._source);
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LocationContrller;

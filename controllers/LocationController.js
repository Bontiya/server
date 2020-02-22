'use strict';
const axios = require('axios');
const { Client } = require('elasticsearch');
const client = new Client({
  host: process.env.ELASTICSEARCH_URI
});


class LocationContrller {
  static async reverseGeoLocation(req, res, next) {
    try {
      const { lat, lon } = req.query;
      if (!lat || !lon) {
        res.status(400).json({ errors: ['latitude and longitude is required!'] });
        return;
      }
      const { data } = await axios({
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lon}&key=${process.env.GOOGLE_MAP_KEY}`
      })
      const placesId = [];
      for (let i = 0; i < data.results.length; i++) {
        placesId.push(data.results[i].place_id);
      }
      const placesName = [];
      const promises = []
      placesId.forEach((id) => {
        promises.push(axios({
          method: 'GET',
          url: `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_MAP_KEY}&place_id=${id}&fields=name`
        }))
      })
      Promise
        .all(promises)
        .then((results) => {
          results.forEach(result => {
            placesName.push(result.data.result.name)
          })
          res.status(200).json(placesName);
        })
        .catch(next)
    } catch (err) {
      next(err);
    }
  }

  static async queryLocation(req, res, next) {
    try {
      const { q, lat, lon } = req.query;
      if (!q) {
        res.status(400).json({ errors: ['query q is required as location name'] });
        return;
      };
      const body = {
        size: 200,
        from: 0,
        query: {
          match: {
            name: {
              query: q
            },
          },
        },
      };
      const hits = await client.search({
          index: 'place-suggestions',
          body: body,
          type: 'location-list' 
        })
      const place_prediction = [];
      const { data }  = await axios({
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${q}&types=establishment&key=${process.env.GOOGLE_MAP_KEY}&radius=500&limit=10&location=${lat},${lon}`
      });
      for (let i = 0; i < data.predictions.length; i++) {
        const detail = {
          id: data.predictions[i].place_id,
          name: data.predictions[i].structured_formatting.main_text,
          description: data.predictions[i].description
        };
        place_prediction.push(detail);
      }
      if (hits.hits.hits.length < 1) {
        res.status(200).json(place_prediction);
      } else {
        place_prediction.unshift(hits.hits.hits[0]._source)
        res.status(200).json(place_prediction);
      }
    } catch (err) {
      next(err);
    }
  }
  static async getLocationDetail(req, res, next) {
    try {
      const { placeid } = req.query;
      if (!placeid) {
        res.status(400).json({ errors: ['placeid is required!'] });
        return;
      }
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
        const { data } = await axios({
          method: 'GET',
          url: `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_MAP_KEY}&place_id=${placeid}&fields=address_component,name,vicinity,geometry`
        })
        const placeDetail = {
          id: placeid,
          name: data.result.name,
          description: data.result.vicinity,
          lat: data.result.geometry.location.lat,
          lon: data.result.geometry.location.lng
        };
        client.bulk({
          body: [
            {
              index: {
                _index:"place-suggestions", 
                _type:"location-list",}
            },
            placeDetail
          ]
        });
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

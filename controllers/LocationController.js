'use strict';
const axios = require('axios');
const { Client } = require('elasticsearch');
const client = new Client({
  host: process.env.ELASTICSEARCH_URI
});
const redis = require('../redis');
const polyline = require('@mapbox/polyline');


class LocationContrller {
  static async routes(req, res, next) {
    try {
      const { origin, destination } = req.query;
      const { data } = await axios({
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}
        &destination=${destination}&key=${process.env.GOOGLE_MAP_KEY}`
      });
      if (data.status === 'NOT_FOUND' || data.status === 'ZERO_RESULTS') {
        // how to catch this error on errHandler?
        throw new Error('Location Not Found');
      } else {
        const response = [];
        const polylineDecoding = polyline.decode(data.routes[0].overview_polyline.points)
        polylineDecoding.forEach((code) => {
          const detail = {
            latitude: code[0],
            longitude: code[1],
          };
          response.push(detail);
        })
        res.status(200).json(response);
      }
    } catch (err) {
      next(err);
    }
  }
  
  static async reverseGeoLocation(req, res, next) {
    try {
      const { lat, lon } = req.query;
      if (!lat || !lon) {
        res.status(400).json({ errors: ['latitude and longitude is required!'] });
      } else {
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
      }
    } catch (err) {
      next(err);
    }
  }
  static async queryLocation(req, res, next) {
    try {
      const { q } = req.query;
      if (!q) {
        res.status(400).json({ errors: ['query q is required as location name'] });
        return;
      };
      const body = {
        size: 200,
        from: 0,
        query: {
          match: {
            name: q
          },
        },
      };
      const hits = await client.search({
          index: 'place-suggestions',
          body: body,
          type: 'location-list' 
        })
      const place_prediction = [];
      const dataBulk = [];
      if (!hits.hits.max_score) {
        const { data }  = await axios({
          method: 'GET',
          url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${q}&types=establishment&key=${process.env.GOOGLE_MAP_KEY}&limit=10&location=0.7893,113.9213`
        });
        for (let i = 0; i < data.predictions.length; i++) {
          const detail = {
            id: data.predictions[i].place_id,
            name: data.predictions[i].structured_formatting.main_text,
            description: data.predictions[i].description
          };
          dataBulk.push({
            index:  {
              _index:"place-suggestions", 
              _type:"location-list"
            }}, detail);
          place_prediction.push(detail);
        }
        client.bulk({
          body: dataBulk
        }, function (err) {
          if (err) next(err);
        })
        res.status(200).json(place_prediction);
      } else {
        hits.hits.hits.forEach((hit) => {
          place_prediction.push(hit._source);
        });
        res.status(200).json(place_prediction);
      }
    } catch (err) {
      next(err);
    }
  }
  static async  getLocationDetail(req, res, next) {
    try {
      const { placeid } = req.query;
      if (!placeid) {
        res.status(400).json({ errors: ['placeid is required!'] });
        return;
      }
      const onRedis = await redis.get(placeid);
      if (!onRedis) {
        const { data } = await axios({
          method: 'GET',
          url: `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_MAP_KEY}&place_id=${placeid}&fields=address_component,name,vicinity,geometry`
        });
        const placeDetail = {
          id: placeid,
          name: data.result.name,
          description: data.result.vicinity,
          lat: data.result.geometry.location.lat,
          lon: data.result.geometry.location.lng
        };
        const redisValue = JSON.stringify(placeDetail);
        redis.set(placeid, redisValue, 'EX', 86400);
        res.status(200).json(placeDetail);
      } else {
        const placeDetail = JSON.parse(onRedis);
        res.status(200).json(placeDetail);
      }
    } catch (err) {
      next(err);
    }
  }
  static async getTravelDuration(req, res, next) {
    try {
      const { origins, destination } = req.query
      /** mode
       * driving (default)
       * walking
       * bicycling
       * transit
       */
      const mode = req.query.mode || 'driving'
      const { data } = await axios({
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origins}&destinations=${destination}&key=${process.env.GOOGLE_MAP_KEY}&mode=${mode}`
      })
      const distanceDetail = {
        originAddress: data.origin_addresses,
        destinationAddress: data.destination_addresses,
        distance: data.rows[0].elements[0].distance.text,
        duration: {
          seconds: data.rows[0].elements[0].duration.value,
          durationText: data.rows[0].elements[0].duration,
        },
      };
      res.status(200).json(distanceDetail)
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LocationContrller;

'use strict';
const elasticsearch = require('elasticsearch');

// Elastic search setup,
// this only for creating index.
const client = new elasticsearch.Client({
  host: 'https://aa436zrtfx:zn5oiirkj6@bontiya-8732261900.ap-southeast-2.bonsaisearch.net:443'
});

// client.ping({
//   requestTimeout: 30000
// }, function(err) {
//   if (err) console.log(`Something went wrong, error: ${err}`);
//   else console.log('Everything\'s good');
// });

// ini crate index
client.indices.create({
  index: 'place-suggestions',
}, function(error, response, status) {
  if (error) console.log(error, 'error');
  else console.log('Created new index', response)
})

client.index({
  index: 'place-suggestions',
  id: '1',
  type: 'location-list',
  body: {
    // gatau sih ini buat apa :/
    'Key1': 'Content for key one',
    'Key2': 'Content for key two',
    'key3': 'Content for key three',
  }
}, function(err, response, status) {
  if (err) console.log(err, 'error')
  else console.log(response, 'Index ');
});


// client.index({
//   index: 'place-suggestions',
//   id: '1',
//   type: 'location-list',
//   body: {
//     // gatau sih ini buat apa :/
//     'Key1': 'Content for key one',
//     'Key2': 'Content for key two',
//     'key3': 'Content for key three',
//   }
// }, function(err, response, status) {
//   if (err) console.log(err, 'error')
//   else console.log(response, 'Index ');
// });

module.exports = client;

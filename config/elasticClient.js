const { Client } = require('elasticsearch');
const client = new Client({
  node: process.env.ELASTICSEARCH_URI,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
});
module.exports = client;

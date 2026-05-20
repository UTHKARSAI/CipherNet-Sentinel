// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {

  res.send('CipherNet-Sentinel Backend Running');

});

app.get('/traffic', (req, res) => {

  const trafficData = [

    {
      ip: '192.168.1.5',
      packets: 120,
      protocol: 'TCP',
      threat: 'Low'
    },

    {
      ip: '10.0.0.2',
      packets: 560,
      protocol: 'UDP',
      threat: 'High'
    },

    {
      ip: '172.16.0.7',
      packets: 300,
      protocol: 'ICMP',
      threat: 'Medium'
    }

  ];

  res.json(trafficData);

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});
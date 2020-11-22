const express = require('express');
const router = express.Router();
const cpuLoad = require('../../lib/cpuUsage');

router.get('/cpuLoad', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) {
    return res.send({ status: 400, error: 'You didn\'t provide a valid api key || headers[\'api_key\'] is missing' });
  }
  cpuLoad.GetCurrentLoad()
    .then(load => res.send({ load }))
    .catch(err => res.send({ status: 400, error: err }));
});

router.get('/cpuLoadOn', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) {
    return res.send({ status: 400, error: 'You didn\'t provide a valid api key || headers[\'api_key\'] is missing' });
  }
  const cpuNb = Number(req.body.cpu_nb);
  cpuLoad.GetCurrentLoadOnCpu(cpuNb)
    .then(load => res.send({ load, cpuNb: cpuNb }))
    .catch(err => res.send({ status: 400, error: err }));
});

router.get('/cpuLoadOnEach', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) {
    return res.send({ status: 400, error: 'You didn\'t provide a valid api key || headers[\'api_key\'] is missing' });
  }
  cpuLoad.GetCurrentLoadOnEach()
    .then(load => res.send({ load }))
    .catch(err => res.send({ status: 400, error: err }));
});

router.get('/cpusAvgSpeed', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) {
    return res.send({ status: 400, error: 'You didn\'t provide a valid api key || headers[\'api_key\'] is missing' });
  }
  cpuLoad.GetAVGCpusSpeed()
    .then(speed => res.send({ speed }))
    .catch(err => res.send({ status: 400, error: err }));
});



module.exports = router;

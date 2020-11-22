const express = require('express');
const router = express.Router();
const cpuLoad = require('../../lib/cpuUsage');
const hdUsage = require('../../lib/hdUsage');
const fetch = require('node-fetch');

router.get('/this_server_stat', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) {
    return res.send({ status: 400, error: 'You didn\'t provide a valid api key || headers[\'api_key\'] is missing' });
  }
  try {
    const cpuCurrLoad = await cpuLoad.GetCurrentLoad();
    const hdCurrUsage = await hdUsage.GetAvailableSpace();
    const curr_ip = await getIPFromAmazon();

    res.send({ cpuLoad: cpuCurrLoad, hdMem: hdCurrUsage, ip: curr_ip.replace('\n', '') })
  }
  catch (err) {
    return res.send({ status: 400, error: err })
  }
});

const getIPFromAmazon = () => {
  return new Promise(
    (resolve, reject) => {
      fetch("https://checkip.amazonaws.com/")
        .then(res => res.text())
        .then(
          data => {
            resolve(data)
          },
          err => {
            reject(err)
          });
    });
}

module.exports = router;

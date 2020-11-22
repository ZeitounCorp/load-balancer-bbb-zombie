const express = require('express');
const router = express.Router();
const hdUsage = require('../../lib/hdUsage');


router.get('/diskInfo', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) {
    return res.send({ status: 400, error: 'You didn\'t provide a valid api key || headers[\'api_key\'] is missing' });
  }
  hdUsage.GetDiskInfo()
    .then(disk_info => res.send({ disk_info }))
    .catch(err => res.send({ status: 400, error: err }));
});

router.get('/available_space', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) {
    return res.send({ status: 400, error: 'You didn\'t provide a valid api key || headers[\'api_key\'] is missing' });
  }
  hdUsage.GetAvailableSpace()
    .then(available => res.send({ available }))
    .catch(err => res.send({ status: 400, error: err }));
});

router.get('/disk_read_write_stats', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) {
    return res.send({ status: 400, error: 'You didn\'t provide a valid api key || headers[\'api_key\'] is missing' });
  }
  hdUsage.GetDiskRWStats()
    .then(stats => res.send({ stats }))
    .catch(err => res.send({ status: 400, error: err }));
});


module.exports = router;

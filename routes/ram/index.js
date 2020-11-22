const express = require('express');
const router = express.Router();
const rMemoryUsage = require('../../lib/rMemoryUsage');

router.get('/get_ram_info', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) {
    return res.send({ status: 400, error: 'You didn\'t provide a valid api key || headers[\'api_key\'] is missing' });
  }

  const type = req.body.type;

  rMemoryUsage.GetRAMInfo(type)
    .then(memory_stat => res.send({ memory_stat, filtered_by: type }))
    .catch(err => res.send({ status: 400, error: err }));
});




module.exports = router;

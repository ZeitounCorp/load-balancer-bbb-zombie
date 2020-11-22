const express = require('express');
const router = express.Router();
const processesUsage = require('../../lib/processes');

router.get('/processes_list_by_status', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) {
    return res.send({ status: 400, error: 'You didn\'t provide a valid api key || headers[\'api_key\'] is missing' });
  }

  const status = req.body.filter;
  if (!status) {
    return res.send({ status: 400, error: 'You didn\'t provide a processes filter' });
  }

  processesUsage.GetProcessesListByStatus(status)
    .then(processes => res.send({ processes, filtered_by: status }))
    .catch(err => res.send({ status: 400, error: err }));
});

router.get('/processes_list', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) {
    return res.send({ status: 400, error: 'You didn\'t provide a valid api key || headers[\'api_key\'] is missing' });
  }
  const percent = Number(req.body.percent);
  processesUsage.GetProcessesList(percent)
    .then(processes => res.send({ processes, nb_of_processes: processes.length, usage_sup_to: `${percent}%` }))
    .catch(err => res.send({ status: 400, error: err }));
});

router.get('/most_intensive_process', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) {
    return res.send({ status: 400, error: 'You didn\'t provide a valid api key || headers[\'api_key\'] is missing' });
  }
  processesUsage.GetMostIntensiveProcess()
    .then(process => res.send({ process }))
    .catch(err => res.send({ status: 400, error: err }));
});


module.exports = router;

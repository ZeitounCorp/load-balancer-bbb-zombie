const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { exec } = require("child_process");

const api_key_missing = '*You didn\'t provide a valid api key* || field \'api_key\' is missing';
const error_logs_lvls = ['DEBUG', 'INFO', 'NOTICE', 'WARN', 'ERROR', 'CRIT', 'ALERT', 'EMERG'];

// Slack details
const channel_id = "C01GB3Q0HC6"; // => monitoring-bot-channel
const slack_upload_endpoint = "https://slack.com/api/files.upload";
const bot_token = "YOUR_TOKEN";

router.get('/error_dev', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) return res.send({ text: api_key_missing, error: true });

  const { error_level } = req.body;

  const iterable_lvls = return_all_lvls_of_log(error_level);

  const file_ = fs.readFileSync('/var/log/syslog', 'utf8');
  const line_by_line = file_.split('\n');

  const errors = [];

  for (let k = 0; k < line_by_line.length; k++) {
    for (let i = 0; i < iterable_lvls.length; i++) {
      if (line_by_line[k].includes(iterable_lvls[i])) {
        errors.push(line_by_line[k]);
      }
    }
  }

  const returnables = errors.slice(errors.length - 52);
  createSlicedLogFile(returnables, error_level, res);
});

function return_all_lvls_of_log(lvl) {
  const LVL = lvl.toUpperCase();
  const start_index = error_logs_lvls.indexOf(LVL);
  const lvls_all = error_logs_lvls.slice(start_index);

  return lvls_all;
}

function createSlicedLogFile(data = [], error_level, res) {
  const asString = data.join('\n');
  const uniq = Date.now();
  fs.writeFile(path.join(__dirname, `tmp/log_${uniq}.txt`), asString, function (err) { console.log(err) });
  exec(`cd ${path.join(__dirname, 'tmp/')} && curl -F file=@log_${uniq}.txt -F "initial_comment=New Log Generated, ERROR_LVL: ${error_level.toUpperCase()}" -F channels=${channel_id} -H "Authorization: Bearer ${bot_token}" ${slack_upload_endpoint}`, (error, stdout, stderr) => {
    if (error) {
      return res.send({ exec_error: true, text: error.message, error: true });
    }
    if (stderr) {
      return res.send({ exec_error: false, text: stderr, error: true });
    }

      return res.send({ success: true, text: stdout, error: false });
  });
}

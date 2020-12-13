const express = require('express');
const router = express.Router();
const { exec } = require("child_process");

const api_key_missing = '*You didn\'t provide a valid api key* || field \'api_key\' is missing';

const cmd_for_errors = {
  "2001": "sudo service bbb-webrtc-sfu restart",
  "1020": "sudo systemctl restart kurento-media-server.service bbb-webrtc-sfu.service",
  "2003": "sudo systemctl restart kurento-media-server.service bbb-webrtc-sfu.service",
  "1002": "TODO"
};

router.get('/error_dev', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) return res.send({ text: api_key_missing, error: true });

  // Get the error_code from the request body in order to execute the associated fix 
  const { error_code } = req.body;

  // If error_code is different from 1005 || 1006
  if (!["1005", "1006"].includes(error_code)) {
    exec(cmd_for_errors[error_code], (error, stdout, stderr) => {
      if (error) {
        return res.send({ exec_error: true, text: error.message, error: true });
      }
      if (stderr) {
        return res.send({ exec_error: false, text: stderr, error: true });
      }
      return res.send({ success: true, text: stdout, error: false });
    });
  } else {
    exec("sudo systemctl stop freeswitch", (error, stdout, stderr) => {
      if (error) {
        return res.send({ exec_error: true, text: error.message, error: true, service: 'freeswitch stop' });
      }
      if (stderr) {
        return res.send({ exec_error: false, text: stderr, error: true, service: 'freeswitch stop' });
      }
      exec("sudo systemctl start freeswitch", (error_str, stdout_str, stderr_str) => {
        if (error) {
          return res.send({ exec_error: false, text: error_str.message, error: true, service: 'freeswitch start' });
        }
        if (stderr) {
          return res.send({ exec_error: false, text: stderr_str, error: true, service: 'freeswitch start' });
        }
        return res.send({ success: true, text: stdout_str, error: false });
      });
    });
  }
});




module.exports = router;

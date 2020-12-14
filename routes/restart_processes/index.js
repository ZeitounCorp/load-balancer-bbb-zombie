const express = require('express');
const router = express.Router();
const { exec } = require("child_process");

const api_key_missing = '*You didn\'t provide a valid api key* || field \'api_key\' is missing';

const cmd_for_errors = {
  "2001": "sudo service bbb-webrtc-sfu restart",
  "1020": "sudo systemctl restart kurento-media-server.service bbb-webrtc-sfu.service",
  "2003": "sudo systemctl restart kurento-media-server.service bbb-webrtc-sfu.service",
  "1005": "sudo systemctl stop freeswitch && sudo systemctl start freeswitch",
  "1006": "sudo systemctl stop freeswitch && sudo systemctl start freeswitch",
  "1002": "TODO"
};

router.get('/error_dev', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) return res.send({ text: api_key_missing, error: true });

  // Get the error_code from the request body in order to execute the associated fix 
  const { error_code } = req.body;

  exec(cmd_for_errors[error_code], (error, stdout, stderr) => {
    if (error) {
      return res.send({ exec_error: true, text: error.message, error: true, cmd: cmd_for_errors[error_code] });
    }
    if (stderr) {
      return res.send({ exec_error: false, text: stderr, error: true, cmd: cmd_for_errors[error_code] });
    }
    return res.send({ success: true, text: stdout, error: false, cmd: cmd_for_errors[error_code] });
  });
});




module.exports = router;

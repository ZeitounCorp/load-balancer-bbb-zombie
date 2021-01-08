const express = require('express');
const router = express.Router();
const { exec } = require("child_process");

const api_key_missing = '*You didn\'t provide a valid api key* || field \'api_key\' is missing';

router.post('/terminal_cmd', async function (req, res) {
  if (!req.headers['api_key'] || req.headers['api_key'] !== process.env.API_KEY) return res.send({ text: api_key_missing, error: true });

  const { cmd } = req.body;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return res.send({ exec_error: true, text: error.message, error: true, cmd: cmd });
    }
    if (stderr) {
      return res.send({ exec_error: false, text: stderr, error: true, cmd: cmd });
    }
    return res.send({ success: true, text: stdout, error: false, cmd: cmd });
  });
});




module.exports = router;

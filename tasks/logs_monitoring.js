const follow = require('text-file-follower');
const axios = require('axios').default;
const NginxConfFile = require('nginx-conf').NginxConfFile;

// Create a watcher for logfile
const follower = follow('/var/log/syslog', { persistent: true });
// Errors we want to receive an alert for
const error_logs_lvls = ['ERROR', 'CRIT', 'ALERT', 'EMERG'];
// Slack details
const slack_webhook_endpoint = process.env.SLACK_WEBHOOK || "YOUR_SLACK_WEBHOOK";

// Added some debug functions for the follower
follower.on('close', function () {
  console.log("We must have called follower.close()");
});
follower.on('error', function (event, filename, value) {
  console.log("Oh noes! Here's the error message: " + value);
});

NginxConfFile.create('/etc/nginx/sites-available/bigbluebutton', async (err, conf) => {
  if (err) {
    return err;
  }
  follower.on('line', async function (filename, line) {
    if (error_logs_lvls.some(t => line.includes(t))) {
      return await axios.post(slack_webhook_endpoint, {
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*Server name: ${conf.nginx.server[1].server_name._value}*`
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*Seems like something abnormal happened*: ${line}`
            }
          }
        ],
        response_type: "in_channel"
      });
    }
  });
});

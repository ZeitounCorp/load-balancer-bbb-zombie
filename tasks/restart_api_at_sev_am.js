const CronJob = require('cron').CronJob;
const { exec } = require("child_process");

const job = new CronJob('00 00 07 * * *', async function () {
  const d = new Date();
  console.log(d);
  exec('pm2 restart 0', (error, stdout, stderr) => {
    if (error) {
      console.log('error running pm2 restart 0, ERROR: ' + error);
    }
    if (stderr) {
      console.log('error executing pm2 restart 0, ERROR: ' + stderr);
    }
    console.log('Success exec pm2 restart 0, RESULT: ' + stdout);
  });
});


job.start();

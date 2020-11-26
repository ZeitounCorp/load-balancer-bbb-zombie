module.exports = {
  apps: [{
    name: "zombie_api_bbb",
    script: "./server_bbb.js",
    watch: ["./.authorized_servers.json", "./.env"],
    // Delay between restart
    autorestart: true,
    watch_delay: 100,
    watch_options: {
      "followSymlinks": false
    }
  }]
}

## load-balancer-bbb-zombie
This repository comes from the main project [/ZeitounCorp/load-balancer/servers/BBB](https://github.com/ZeitounCorp/load-balancer)

## PM2 related
- After executing the install_passive script from the main repository:
1. ```source ~/.nvm/nvm.sh```
- To ensure that if the server restarts the api will restart automatically
1. ```pm2 startup```
2. Copy/Paste the command that comes out and press enter
2. ```pm2 save``` 

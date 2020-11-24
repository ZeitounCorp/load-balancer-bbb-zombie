## load-balancer-bbb-zombie
This repository comes from the main project [/ZeitounCorp/load-balancer/servers/BBB](https://github.com/ZeitounCorp/load-balancer)

## Post-install requirements
- ```cd load-balancer-bbb-zombie```
- ```touch .authorized_servers.json .env```

### .authorized_servers.json
- Add an Array of servers (load-balancers) that are allowed to access the API

### .env
- Must include an API_KEY=the_key_you_generated_to_secure_your_api and a PORT(else served over port 3001)

## PM2 related
- After executing the install_passive script from the main repository:
1. ```source ~/.nvm/nvm.sh```
- To ensure that if the server restarts the api will restart automatically
1. ```pm2 startup```
2. Copy/Paste the command that comes out and press enter
2. ```pm2 save``` 

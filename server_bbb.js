require('dotenv').config()
const cors = require("cors");
const port = process.env.PORT || 5555;

const authorized_servers = require('./.authorized_servers.json');

// Express service
const express = require('express');
const app = express();

// Accept request from servers in authorized_servers ...
app.use(cors({
  origin: authorized_servers,
  credentials: true
}));

// Format responses and requests to json 
app.use(express.json());

/**
 * Routes' imports 
 */
const CPU = require('./routes/cpu');
const RAM = require('./routes/ram');
const HDMEM = require('./routes/hmemory');
const PROCESSES = require('./routes/processes');
const WHICHSERV = require('./routes/which_server');
const RESTART = require('./routes/restart_processes');

/**
 * Routes Middleware
 */
app.use('/cpu_usage', CPU); // Get Cpu Usage for BBB each server
app.use('/r_memory', RAM); // Get RAM memory available on each server
app.use('/hd_memory', HDMEM); // Get Hard Drive memory available on each server
app.use('/processes', PROCESSES); // Get Processes running on each server
app.use('/which_to_use', WHICHSERV); // Get the server to use depending on memory, cpu and ram available
app.use('/restart', RESTART); // Endpoint for the slack bot commands

/**
 *  Launching the api
 */
app.listen(port, () => { console.log('API is up and running'); });

module.exports = app;

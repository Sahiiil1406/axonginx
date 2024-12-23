const parserYaml = require('./utils/parser.js')
const {validateConfig} = require('./validators/config.validator.js')
const {createServer,app} = require('./server.js')


//validating and parsing the yaml file
const config=parserYaml('./config.yaml')
validateConfig('./Yamltojson.json')

//create server
const workers=config.nginx.worker_processes==='auto'?require('os').cpus().length:config.nginx.worker_processes
createServer(config.nginx.port,workers,config)



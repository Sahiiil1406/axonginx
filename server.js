const express = require('express');
const app = express();
const cluster = require('node:cluster');
const cacheManager = require('./cache/cacheManager.js');
const { renderFile } = require('./utils/render.js');
const { fetchData } = require('./utils/fetch.js');
const https = require('https');
const fs=require('fs')
const {LoadBalancer} = require('./load-balancer/main.js');




const sslOptions = {
    key: fs.readFileSync('./templates/server.key'), // Path to your private key
    cert: fs.readFileSync('./templates/server.crt') // Path to your certificate
};



function createServer(PORT, numCPUs, config) {
    const CLUSTER_POOL = [];
    const LOAD_BALANCER=[];
    let i;
    for( i=0;i<config.nginx.load_balancer.length;i++){
        let y;
        for(let k=0;k<config.nginx.upstreams.length;k++){
            if(config.nginx.upstreams[i].name==config.nginx.load_balancer[i].upstream){
                y=config.nginx.upstreams[i].servers;
            }
        }
        //console.log(p)
        const z=config.nginx.load_balancer[i];
        const weigh=z.weight?z.weight:[]
        const t=new LoadBalancer(y,z.algorithm,weigh);
        LOAD_BALANCER.push(t)
    }
   // console.log(LOAD_BALANCER)
    
    

    if (cluster.isMaster) {
        for (let i = 0; i < numCPUs; i++) {
            const c = cluster.fork();
            CLUSTER_POOL.push(c);
        }
        console.log(`Master ${process.pid} started`);
        renderFile(app,config);
        config.nginx.proxies.forEach((element)=>{
            app.all(element.location, (req, res) => {
                const key = element.upstream; // Dynamic cache key using request URL
                const cachedResponse = cacheManager.getCacheByKey(key);
                //console.log(cacheManager.getAllKeys())
                if (cachedResponse) {
                    console.log('Cache hit');
                    Object.entries(cachedResponse.headers).forEach(([headerName, headerValue]) => {
                        res.setHeader(headerName, headerValue);
                    });
                    res.send(cachedResponse.body);
                    return;
                }
                const worker = CLUSTER_POOL[Math.floor(Math.random() * numCPUs)];
                worker.send({ key, headers: req.headers });
            
                worker.once('message', (msg) => {
                    console.log(`Worker ${worker.process.pid} responded`);
                    //msg has headers and body
                    Object.entries(msg.headers).forEach(([headerName, headerValue]) => {
                        res.setHeader(headerName, headerValue);
                    });
                    res.send(msg.body);
                });
            });
            })

            
            config.nginx.load_balancer.forEach((element,index)=>{
            app.all(element.location, (req, res) => {
                const key = LOAD_BALANCER[index].getNextServer('ip'); // Get key by algorithm from load-balancer 
                const cachedResponse = cacheManager.getCacheByKey(key);
                //console.log(cacheManager.getAllKeys())
                if (cachedResponse) {
                    console.log('Cache hit');
                    Object.entries(cachedResponse.headers).forEach(([headerName, headerValue]) => {
                        res.setHeader(headerName, headerValue);
                    });
                    res.send(cachedResponse.body);
                    return;
                }
                const worker = CLUSTER_POOL[Math.floor(Math.random() * numCPUs)];
                worker.send({ key, headers: req.headers });
            
                worker.once('message', (msg) => {
                    console.log(`Worker ${worker.process.pid} responded`);
                    //msg has headers and body
                    Object.entries(msg.headers).forEach(([headerName, headerValue]) => {
                        res.setHeader(headerName, headerValue);
                    });
                    res.send(msg.body);
                });
            });
            })

           
         //ssl certification
        if(config.nginx.ssl===true){
            const httpsServer = https.createServer(sslOptions, app);
            httpsServer.listen(PORT, () => {
                console.log(`Server started at https://localhost:${PORT}`);
                //console.log(sslOptions)
            });
        }else{
            app.listen(PORT, () => {
                console.log(`Server started at http://localhost:${PORT}`);
                //console.log(sslOptions)
            });
        }

    } else {
        console.log(`Worker ${process.pid} started`);

        
        process.on('message', async ({ key, headers }) => {
            try {
            const {body,headers}= await fetchData(key);
            //console.log(body)
            cacheManager.addCache(key,{
                body:body,
                headers:headers,
                url:key
            })
            process.send({ headers: headers, body:body });
            } catch (error) {
                console.error(`Worker ${process.pid} failed to fetch data:`, error.message);
                process.send({ headers: {}, body: 'Error fetching data' });
            }
        });
    }
}

module.exports = { createServer, app };

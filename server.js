const express = require('express');
const app = express();
const cluster = require('node:cluster');
const cacheManager = require('./cacheManager');
const { renderFile } = require('./utils/render.js');
const { fetchData } = require('./utils/fetch.js');



/*app.all('/test', (req, res) => {
    const key = 'http://localhost:8000'; // Dynamic cache key using request URL
    const cachedResponse = cacheManager.getCacheByKey(key);

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
*/

function createServer(PORT, numCPUs, config) {
    const CLUSTER_POOL = [];

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
                console.log(cacheManager.getAllKeys())
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

        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`);
        });

    } else {
        console.log(`Worker ${process.pid} started`);

        
        process.on('message', async ({ key, headers }) => {
            try {
            const {body,headers}= await fetchData(key);
            console.log(body)
            cacheManager.addCache(1,"Hello")
            process.send({ headers: headers, body:body });
            } catch (error) {
                console.error(`Worker ${process.pid} failed to fetch data:`, error.message);
                process.send({ headers: {}, body: 'Error fetching data' });
            }
        });
    }
}

module.exports = { createServer, app };

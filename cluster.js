const cluster = require('cluster')
const dotenv = require('dotenv').config()


const startWorker = () => {
    let worker = cluster.fork()
    console.log(`CLUSTER: Worker ${worker.id} started`)
}

console.log('ENV ==> ', process.env.NODE_ENV)

if(cluster.isPrimary){
    require('os').cpus().forEach(()=>{
        startWorker()
    })

    cluster.on('disconnect', (worker)=>{
        console.log(`CLUSTER: Worker ${worker.id} disconnected from cluster`)
    })

    cluster.on('exit', (worker,code,signal) => {
        console.log(`Cluster: Worker ${worker.id} died with exit code ${code} (${signal})`)
        startWorker()
    })
} else {
    require('./server.js')()
}


const redis = require('redis');
const client = redis.createClient({
    host: 'localhost',
    port: 6379
});

client.on('error', (err)=>{
    console.log('Redis error', err);
})

client.on('connect', ()=>{
    console.log("Redis connected successfully");
})
client.connect()

module.exports = client
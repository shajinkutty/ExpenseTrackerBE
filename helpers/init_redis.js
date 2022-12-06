// const redis = require("redis");

// const client = redis.createClient(process.env.REDISCLOUD_URL, {
//   no_ready_check: true,
// });

// client.on("connect", () => {
//   console.log("Client connected to redis");
// });

// client.on("ready", () => {
//   console.log("client connected to redis and ready to use");
// });

// client.on("error", (err) => {
//   console.log(err.message);
// });

// client.on("end", () => {
//   console.log("Client disconnected from redis");
// });

// module.exports = client;

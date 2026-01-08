module.exports = (redisClient, subscriberClient) => {
  require('./new-user').handleEvent(redisClient, subscriberClient)
}

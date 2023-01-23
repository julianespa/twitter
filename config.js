module.exports = {
    debugMode: false,
    api: {
        host: process.env.HOSTV || "http://api.localhost:80"
    },
    tweets: {
        maxTweetSize: 140
    }
}

//https://minitwitterapi.reactiveprogramming.io
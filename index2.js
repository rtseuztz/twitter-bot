import { TwitterApi } from 'twitter-api-v2';
import Twit from 'twit';
// Instantiate with desired auth type (here's Bearer v2 auth)
const twit = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_KEY_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

twit.post('statuses/update', { status: 'bazinga' }, function (err, data, response) {
    console.log(data)
})

// const twitterClient = new TwitterApi(process.env.BEARER_TOKEN);
// // Tell typescript it's a readonly app
// const readOnlyClient = twitterClient.readOnly;

// // Play with the built in methods
// // You can upload media easily!
// // const mediaid = await twitterClient.v1.uploadMedia('./cat.jpg');
// // const tweet = await twitterClient.v1.tweet('kitty', { media_ids: mediaid });
// // console.log(tweet)
// twitterClient.v1.tweet('This tweet was written by a bot').then((val) => {
//     console.log(val)
//     console.log("success")
// }).catch((err) => {
//     console.log(err)
// })
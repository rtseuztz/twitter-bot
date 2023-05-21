import { TwitterApi } from "twitter-api-v2";
import response from './tweet_generator.js';

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

const tweet = response.data.choices[0].text.replace(/^["'](.+(?=["']$))["']$/, '$1')
const res = await client.v2.tweet(tweet)
console.log(res)
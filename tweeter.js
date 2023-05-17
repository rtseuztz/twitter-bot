import got from 'got';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import qs from 'querystring';
import response from './tweet_generator.js';
import readline from 'readline';
import puppeteer from 'puppeteer';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// The code below sets the consumer key and consumer secret from your environment variables
// To set environment variables on macOS or Linux, run the export commands below from the terminal:
// export CONSUMER_KEY='YOUR-KEY'
// export CONSUMER_SECRET='YOUR-SECRET'
const consumer_key = process.env.TWITTER_API_KEY;
const consumer_secret = process.env.TWITTER_API_KEY_SECRET;


// Be sure to add replace the text of the with the text you wish to Tweet.
// You can also add parameters to post polls, quote Tweets, Tweet with reply settings, and Tweet to Super Followers in addition to other features.
const data = {
    "text": response.data.choices[0].text.replace(/^["'](.+(?=["']$))["']$/, '$1')
};

const endpointURL = `https://api.twitter.com/2/tweets`;

// this example uses PIN-based OAuth to authorize the user
const requestTokenURL = 'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
const accessTokenURL = 'https://api.twitter.com/oauth/access_token';
const oauth = OAuth({
    consumer: {
        key: consumer_key,
        secret: consumer_secret
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});

async function input(prompt) {
    return new Promise(async (resolve, reject) => {
        rl.question(prompt, (out) => {
            rl.close();
            resolve(out);
        });
    });
}

async function requestToken() {
    const authHeader = oauth.toHeader(oauth.authorize({
        url: requestTokenURL,
        method: 'POST'
    }));

    const req = await got.post(requestTokenURL, {
        headers: {
            Authorization: authHeader["Authorization"]
        }
    });
    if (req.body) {
        return qs.parse(req.body);
    } else {
        throw new Error('Cannot get an OAuth request token');
    }
}


async function accessToken({
    oauth_token,
    oauth_token_secret
}, verifier) {
    const authHeader = oauth.toHeader(oauth.authorize({
        url: accessTokenURL,
        method: 'POST'
    }));
    const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`
    const req = await got.post(path, {
        headers: {
            Authorization: authHeader["Authorization"]
        }
    });
    if (req.body) {
        return qs.parse(req.body);
    } else {
        throw new Error('Cannot get an OAuth request token');
    }
}


async function getRequest({
    oauth_token,
    oauth_token_secret
}) {

    const token = {
        key: oauth_token,
        secret: oauth_token_secret
    };

    const authHeader = oauth.toHeader(oauth.authorize({
        url: endpointURL,
        method: 'POST'
    }, token));

    const req = await got.post(endpointURL, {
        json: data,
        responseType: 'json',
        headers: {
            Authorization: authHeader["Authorization"],
            'user-agent': "v2CreateTweetJS",
            'content-type': "application/json",
            'accept': "application/json"
        }
    });
    if (req.body) {
        return req.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}

const tweet = async () => {
    try {
        // Get request token
        const oAuthRequestToken = await requestToken();
        // Get authorization
        authorizeURL.searchParams.append('oauth_token', oAuthRequestToken.oauth_token);

        //puppeteer, go to the link and click the button to get to the pin page
        const browser = await puppeteer.launch({headless: "new"});
        const page = await browser.newPage();
        await page.goto(authorizeURL.href, { waitUntil: 'networkidle2' });

        await page.focus("input[id='username_or_email']");
        await page.keyboard.type(process.env.TWITTER_USERNAME);

        await page.focus("input[id='password']");
        await page.keyboard.type(process.env.TWITTER_PASSWORD);

        await page.click("input[id='allow']");
        await page.waitForSelector("code");
        const element = await page.$("code");
        const value = await page.evaluate(el => el.textContent, element)
        browser.disconnect();

        const pin = value
        
        // await input('Paste the PIN here: ');
        // Get the access token
        const oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());
        // Make the request
        const response = await getRequest(oAuthAccessToken);
        console.dir(response, {
            depth: null
        });
    } catch (e) {
        console.log(e);
        process.exit(-1);
    }
    process.exit();
}
export default tweet;
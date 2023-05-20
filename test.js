import got from 'got';

async function getTrends() {
    const req = await got.get("https://api.twitter.com/1.1/trends/place.json?id=1", {
        responseType: 'json',
        headers: {
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

getTrends().then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});
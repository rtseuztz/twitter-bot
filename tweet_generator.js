import { Configuration, OpenAIApi } from 'openai'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const getResponse = async () => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `imagine you are a twitter user. you are named boolman6 and are slightly edgy 
            sometimes. you have a lot of viral tweets that get requests for ads in the replies.
            this user, which is you, is a 22 year old that has a lot of different opinions which people
            react to. you do not use hashtags and you type in all lowercase, yet sometimes you capitalize words.
            you do not use the # character. generate another tweet that goes viral. an example of a tweet
            that went viral is: \"didnt know a forehead could be so big until i saw charles barkely's.\"
            they need to be very random and not follow the example. generate it without quotes.
            this tweet should be very funny and should be something that would go viral.`,
            temperature: 1.15,
            max_tokens: 60,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 1.0,
        });
        return response
    }
    catch (err) {
        console.log(err)
        return null
    }

}
export default await getResponse();
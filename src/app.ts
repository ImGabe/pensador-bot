import {TwitterClient} from 'twitter-api-client';
import {ToadScheduler, SimpleIntervalJob, AsyncTask} from 'toad-scheduler';
import * as dotenv from 'dotenv';

import generateImg from './generateImg';
import randomPhrase from './randomPhrase';

dotenv.config();

const twitterClient = new TwitterClient({
  apiKey: process.env.CONSUMER_KEY!,
  apiSecret: process.env.CONSUMER_SECRET!,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
});

const post = async () => {
  const data = await twitterClient.accountsAndUsers.followersList();
  const randIndex = Math.floor(Math.random() * data.users.length);
  let {
    profile_image_url_https: avatarUrl,
    screen_name: screenName,
  } = data.users[randIndex];
  avatarUrl = avatarUrl.replace('normal', '400x400');

  generateImg(randomPhrase(), screenName, avatarUrl).then((base64) => {
    twitterClient.media
        .mediaUpload({media_data: base64, media_category: 'TweetImage'})
        .then(async ({media_id_string: mediaIdString}) => {
          twitterClient.tweets
              .statusesUpdate({
                status: `Usuário: @${screenName}`, media_ids: mediaIdString,
              });
        }).catch(console.error);
    console.log(`Time to post: ${Date.now()}`);
  });
};

const scheduler = new ToadScheduler();
const task = new AsyncTask('post on twitter', post, console.error);
const job = new SimpleIntervalJob({hours: Number(process.env.HOURS)}, task);

scheduler.addSimpleIntervalJob(job);


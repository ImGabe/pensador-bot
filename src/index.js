const { readFileSync } = require('fs');

const Twit = require('twit');
const { scheduleJob } = require('node-schedule');

const generateImg = require('./generateImg');
const randomPhrase = require('./randomPhrase');

require('dotenv').config();

const Bot = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});

scheduleJob({ hour: process.env.HOUR, minute: process.env.MINUTE - 1 }, () => {
  Bot.get('followers/list', { screen_name: 'PensadorBot' }, (err, data) => {
    const number = Math.floor(Math.random() * data.users.length);
    const { name, profile_image_url: profileImage } = data.users[number];
    const avatar = profileImage.replace('_normal', '_400x400');

    generateImg(randomPhrase(), name, avatar);
  });
});

scheduleJob({ hour: process.env.HOUR, minute: process.env.MINUTE }, () => {
  const b64content = readFileSync('img/final.png', { encoding: 'base64' });

  Bot.post('media/upload', { media_data: b64content }, (err, data) => {
    const mediaIdStr = data.media_id_string;
    const altText = 'Pensamento do dia!';
    const metaParams = { media_id: mediaIdStr, alt_text: { text: altText } };

    Bot.post('media/metadata/create', metaParams, (e) => {
      if (e) throw e;
    });
  });
});

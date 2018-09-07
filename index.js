
const TelegramBot = require('node-telegram-bot-api');
const xml2json = require('xml-js').xml2json;
const get = require('lodash').get;
const axios = require('axios');
const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});

const getCat = () => {
  return axios.get('http://thecatapi.com/api/images/get?format=xml&results_per_page=1').then(
    (response) => {
      const json = xml2json(response.data, {compact: true, spaces: 4});
      const defaultUrl = 'http://25.media.tumblr.com/tumblr_lpqn543evY1qb1nczo1_500.jpg';
      url = get(JSON.parse(json), 'response.data.images.image.url._text', defaultUrl);
      return url
    }
  );
}

bot.on('message', function (msg) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Another cute cat is on the way 🐈');
  getCat().then((url) => {
    bot.sendPhoto(
      chatId,
      url,
      {
        caption: 'Meow?',
        replyMarkup: JSON.stringify({
          keyboard: [['😻','😽']]
        }),
      },
    )
  }).catch((err) => {
    bot.sendMessage(chatId, 'Something went wrong. 🙀 Maybe try again?');
  });
});

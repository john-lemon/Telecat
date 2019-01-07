
import TelegramBot from 'node-telegram-bot-api';
import { xml2json } from 'xml-js';
import { get }  from 'lodash';
import axios, { AxiosResponse } from 'axios';


const token: string = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});

const getCat = (): Promise<string> => {
  return axios.get('http://thecatapi.com/api/images/get?format=xml&results_per_page=1').then(
    (response: AxiosResponse) => {
      const json = xml2json(response.data, {compact: true, spaces: 4});
      const defaultUrl = 'http://25.media.tumblr.com/tumblr_lpqn543evY1qb1nczo1_500.jpg';
      const url: string = get(JSON.parse(json), 'response.data.images.image.url._text', defaultUrl);
      return url;
    }
  );
}

bot.on('message', function (msg: TelegramBot.Message) {
  const chatId: number = msg.chat.id;
  bot.sendMessage(chatId, 'Another cute cat is on the way 🐈');
  getCat().then((url: string) => {
    bot.sendPhoto(
      chatId,
      url,
      {
        caption: 'Meow?',
        reply_markup: {
          keyboard: [[{text:'😻'},{text:'😽'}]],
        }
      },
    )
  }).catch(() => {
    bot.sendMessage(chatId, 'Something went wrong. 🙀 Maybe try again?');
  });
});



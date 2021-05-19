const path = require('path');
require('dotenv').config({ path: path.join('./', '.env')})
const TelegramBot = require('node-telegram-bot-api');
import { scraping, sendThis, getLatestNum } from './lib.js'

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

bot.on('message', async ({ chat: { id }, text }) => {

  if(text === '/help') {
    bot.sendMessage(id, 'Just send me the "numbers" and I\'ll give you a link and a preview ❤️')
    return
  }

  if (text === '/random') {
    const { img, title, url } = await scraping(await getLatestNum());
    sendThis(bot, id, img, title, url)
    return
  }

  if (!/^\d+$/.test(text)) {
    bot.sendSticker(id, './sticker.webp')
    bot.sendMessage(id, 'Send the numbers, please 😠')
    return
  } 

  const { img, title, url } = await scraping(text);

  sendThis(bot, id, img, title, url)

});
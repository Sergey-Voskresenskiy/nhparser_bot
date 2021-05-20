const path = require('path');
require('dotenv').config({ path: path.join('./', '.env')})
const TelegramBot = require('node-telegram-bot-api');
import { scraping, sendThis, getLatestNum } from './lib.js'

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const reg = new RegExp('^(?:https?:\/\/)?nhentai.net\/g')

bot.onText(reg, async ({ chat: { id } }, { input }) => {
  const { img, title, url, tags } = await scraping(input.match(/\d+/g).toString());
  sendThis(bot, id, img, title, url, tags)
  return 
})

bot.on('message', async ({ chat: { id }, text }) => {

  if (text === '/help' || text === '/start') {
    bot.sendMessage(id, 'Just send me the "numbers/link" and I\'ll give you a link and a preview ❤️')
    return
  }

  if (text === '/random') {
    const { img, title, url, tags } = await scraping(await getLatestNum());
    sendThis(bot, id, img, title, url, tags)
    return
  }

  if (reg.test(text)) return

  if (!/^\d+$/.test(text)) {
    bot.sendSticker(id, './sticker.webp')
    bot.sendMessage(id, 'Send the numbers, please 😠')
    return
  } 

  const { img, title, url, tags } = await scraping(text);

  sendThis(bot, id, img, title, url, tags)
});
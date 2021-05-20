const path = require('path');
require('dotenv').config({ path: path.join('./', '.env')})
const TelegramBot = require('node-telegram-bot-api');
import { scraping, sendThis, getLatestNum } from './lib.js'

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const linkRegex = new RegExp('^(?:https?://)?nhentai.net/g/(\\d+)(?:/|$)')

async function sendPreview(chatId, doujinId) {
  const { img, title, url, tags } = await scraping(doujinId);
  sendThis(bot, chatId, img, title, url, tags)
}

bot.on('message', async ({ chat: { id }, text }) => {
  try {
    if (text === '/help' || text === '/start') {
      bot.sendMessage(id, 'Just send me the "numbers/link" and I\'ll give you a link and a preview ❤️')
      return
    }

    if (text === '/random') {
      await sendPreview(id, await getLatestNum())
      return
    }

    let linkMatch = linkRegex.exec(text)

    if (linkMatch) {
      await sendPreview(id, linkMatch[1])
      return
    } 

    if (/^\d+$/.test(text)) {
      await sendPreview(id, text)
      return
    } 

    bot.sendSticker(id, './sticker.webp')
    bot.sendMessage(id, 'Send the numbers, please 😠')
  }
  catch (e) {
    console.log('error while processing:', e)
    try {
      bot.sendMessage(id, 'Error occurred during processing')
    } catch (e2) {
      console.log('error in try:', e2)
    }
  }
});

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

bot.onText(/\/random/, async ({ chat: { id } }) => {
  const { img, title, url, tags } = await scraping(await getLatestNum());
  sendThis(bot, id, img, title, url, tags)
  return
})


bot.on('message', async ({ chat: { id }, text, message_id: userMessage }) => {
  if (/\/random/.test(text)) return
  if (reg.test(text)) return

  if (text === '/help' || text === '/start') {
    bot.sendMessage(id, 'Just send me the "numbers/link" and I\'ll give you a link and a preview ❤️')
    return
  }

  if (!/^\d+$/.test(text)) {
    const { message_id: stickerMessage } = await bot.sendSticker(id, './sticker.webp')
    const { message_id: textMessage } = await bot.sendMessage(id, 'Send *"numbers"*, please, or *"link"*,\n\nBtw this is "Wrong message", I am deleting!\n🔪', { parse_mode: 'Markdown'})

    const errorTimeout = setTimeout(() =>{
      bot.deleteMessage(id, stickerMessage);
      bot.deleteMessage(id, textMessage);
      bot.deleteMessage(id, userMessage);
      clearTimeout(errorTimeout);
    },6000)

    return
  } 

  const { img, title, url, tags } = await scraping(text);

  sendThis(bot, id, img, title, url, tags)
});
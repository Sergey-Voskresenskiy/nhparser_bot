import path from 'path';
import dotenv from "dotenv"

dotenv.config({path: path.join('./', '.env')})
import TelegramBot from 'node-telegram-bot-api'

import {scraping, sendThis, getLatestNum} from './lib.js'

const bot = new TelegramBot(process.env.TOKEN, {polling: true});

const linkRegex = new RegExp('^(?:https?://)?nhentai.net/g/(\\d+)(?:/|$)')

async function sendPreview(chatId, doujinId) {
    const {message_id} = await bot.sendMessage(chatId, '💖 *Please wait!* 💖', {parse_mode: 'Markdown'})
    const {img, title, url, tags, images} = await scraping(doujinId);
    const {done} = await sendThis(bot, chatId, img, title, url, tags, images)
    if (done) await bot.deleteMessage(chatId, message_id)
}

bot.on('message', async ({chat: {id}, text}) => {
    try {
        if (text === '/help' || text === '/start') {
            await bot.sendMessage(id, 'Just send me the "numbers/link" and I\'ll give you a link and a preview ❤️')
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

        await bot.sendSticker(id, './sticker.webp')
        await bot.sendMessage(id, 'Send the numbers, please 😠')
    } catch (e) {
        console.log('error while processing:', e)
        try {
            await bot.sendMessage(id, 'Error occurred during processing')
        } catch (e2) {
            console.log('error in try:', e2)
        }
    }
});


import path from 'path';
import dotenv from "dotenv"

dotenv.config({path: path.join('./', '.env')})
import TelegramBot from 'node-telegram-bot-api'

import {scraping, sendThis, getLatestNum, getContentToInlineQuery} from './lib.js'

const bot = new TelegramBot(process.env.TOKEN, {polling: true});

const linkRegex = new RegExp('^(?:https?://)?nhentai.net/g/(\\d+)(?:/|$)')
const linkMatch = (text) => linkRegex.exec(text)

async function sendPreview(chatId, doujinId) {
    const {message_id} = await bot.sendMessage(chatId, '💖 *Please wait!* 💖', {parse_mode: 'Markdown'})
    const {img, title, url, tags, images, telegraphUrl} = await scraping(doujinId);
    const {done} = await sendThis(bot, chatId, img, title, url, tags, images, telegraphUrl)
    if (done) await bot.deleteMessage(chatId, message_id)
}

bot.on('inline_query', async (query) => {
    let content = []
    if (query.query && query.query !== '') {
        if (query.query === 'random') {
            const {id, img, title, url, tags, telegraphUrl} = await scraping(await getLatestNum());
            content = await getContentToInlineQuery(id, img, title, url, tags, telegraphUrl)
        }
        if (/^\d+$/.test(query.query)) {
            const {id, img, title, url, tags, telegraphUrl} = await scraping(query.query);
            content = await getContentToInlineQuery(id, img, title, url, tags, telegraphUrl)
        }
        if (linkMatch(query.query)) {
            const {id, img, title, url, tags, telegraphUrl} = await scraping(linkMatch(query.query)[1]);
            content = await getContentToInlineQuery(id, img, title, url, tags, telegraphUrl)
        }

        await bot.answerInlineQuery(query.id, content, {
            cache_time: 0,
        })
    }
});


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

        if (linkMatch) {
            await sendPreview(id, linkMatch(text)[1])
            return
        }

        if (/^\d+$/.test(text)) {
            await sendPreview(id, text)
            return
        }

        await bot.sendSticker(id, './sticker.webp')
        await bot.sendMessage(id, 'Send the numbers, please 😠')
    } catch (e) {
        console.log('error while processing:', e.message)
        try {
            await bot.sendMessage(id, 'Error occurred during processing')
        } catch (e2) {
            console.log('error in try:', e2.message)
        }
    }
});

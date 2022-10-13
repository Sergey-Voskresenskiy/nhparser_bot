import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join("./", ".env") });

const { setupBot } = require('./bot');

(async function () {
  try {
    await setupBot().launch();

    console.clear();
    console.log("🌱 Startup success");
  } catch (error) {
    console.clear();
    console.log("❌ Startup error: ",  error);

    process.once("SIGINT", () => setupBot.stop("SIGINT"));
    process.once("SIGTERM", () => setupBot.stop("SIGTERM"));
  }
})();


// bot.on('message', async ({chat: {id}, text}) => {
//     try {
//         if (text === '/help' || text === '/start') {
//             await bot.sendMessage(id, 'Just send me the "numbers/link" and I\'ll give you a link and a preview ❤️')
//             return
//         }
//         if (text === '/random') {
//             await sendPreview(id, await getLatestNum())
//             return
//         }
//         if (linkMatch(text)) {
//             await sendPreview(id, linkMatch(text)[1])
//             return
//         }
//         if (/^\d+$/.test(text)) {
//             await sendPreview(id, text)
//             return
//         }

//         await bot.sendSticker(id, './sticker.webp')
//         await bot.sendMessage(id, 'Send the numbers, please 😠')
//     } catch (e) {
//         console.log('error while processing:', e.message)
//         try {
//             await bot.sendMessage(id, 'Error occurred during processing')
//         } catch (e2) {
//             console.log('error in try:', e2.message)
//         }
//     }
// });

// import TelegramBot from 'node-telegram-bot-api'

// import {scraping, sendThis, getLatestNum, postOnTelegraPh} from './lib.js'

// const bot = new TelegramBot(process.env.TOKEN, {polling: true});

// const LINK_REGEX = new RegExp('^(?:https?://)?nhentai.net/g/(\\d+)(?:/|$)')
// const linkMatch = (text) => LINK_REGEX.exec(text)

// async function sendPreview(chatId, doujinId) {
//     const {message_id} = await bot.sendMessage(chatId, '💖 *Please wait!* 💖', {parse_mode: 'Markdown'})
//     const {img, title, url, tags, images} = await scraping(doujinId);
//     const {done} = await sendThis(bot, chatId, img, title, url, tags, await postOnTelegraPh({
//         url,
//         tags,
//         titles: title,
//         images
//     }))
//     if (done) await bot.deleteMessage(chatId, message_id)
// }

// let scrapingData = null
// let content = []
// const createContent = ({id, title, url, img, tags}) => {
//     return content.push({
//         id: id.toString(),
//         type: 'photo',
//         title: title.pretty,
//         photo_url: img,
//         thumb_url: img,
//         description: tags,
//         parse_mode: 'markdown',
//         caption: `*#${id}*\n*Eng:*\n${title.english}\n*Japanese:*\n${title.japanese}.\n\n*Tags:*\n${tags}`,
//         replyMarkup: {
//             inline_keyboard: [
//                 [
//                     {
//                         text: '💖',
//                         url
//                     },
//                 ],
//             ]
//         }
//     })
// }

// bot.on('inline_query', async (query) => {
//     if (query.query && query.query !== '') {
//         try {
//             if (query.query === 'random') {
//                 const {id, img, title, url, tags, images} = await scraping(await getLatestNum());
//                 createContent({id, title, url, img, tags})
//                 scrapingData = {id, img, title, url, tags, images}
//             }
//             if (/^\d+$/.test(query.query)) {
//                 const {id, img, title, url, tags, images} = await scraping(query.query);
//                 createContent({id, title, url, img, tags})
//                 scrapingData = {id, img, title, url, tags, images}
//             }
//             if (linkMatch(query.query)) {
//                 const {id, img, title, url, tags, images} = await scraping(linkMatch(query.query)[1]);
//                 createContent({id, title, url, img, tags})
//                 scrapingData = {id, img, title, url, tags, images}
//             }

//             await bot.answerInlineQuery(query.id, content, {
//                 cache_time: 0,
//             })
//         } catch (e) {
//             console.log(e.message);
//         }
//     }
// });

// bot.on('chosen_inline_result', async ({inline_message_id, result_id}) => {
//     try {
//         await bot.editMessageMedia({
//             type: 'photo',
//             media: scrapingData.img,
//             title: scrapingData.title.pretty,
//             photo_url: scrapingData.img,
//             thumb_url: scrapingData.img,
//             description: scrapingData.tags,
//             parse_mode: 'markdown',
//             caption: `*#${result_id}*\n*Eng:*\n${scrapingData.title.english}\n*Japanese:*\n${scrapingData.title.japanese}.\n\n*Tags:*\n${scrapingData.tags}\n[Read in telegraph](${await postOnTelegraPh({
//                 url: `${process.env.URL_DEFAULT}/${result_id}`,
//                 tags: scrapingData.tags,
//                 titles: scrapingData.title,
//                 images: scrapingData.images
//             })})\n[Read in site](${process.env.URL_DEFAULT}/${result_id})`,
//         }, {inline_message_id})
//         // await bot.editMessageCaption({
//         //     replyMarkup: {
//         //         inline_keyboard: [
//         //             [
//         //                 {
//         //                     text: 'Open on site',
//         //                     url: ${process.env.URL_DEFAULT}/${result_id}
//         //                 },
//         //             ],
//         //             [
//         //                 {
//         //                     text: 'Open on telegra.ph',
//         //                     url: await postOnTelegraPh({url: ${process.env.URL_DEFAULT}/${result_id}, tags: scrapingData.tags, titles: scrapingData.title, images: scrapingData.images})
//         //                 }
//         //             ]
//         //         ]
//         //     }
//         // }, {inline_message_id})
//         content = []
//     } catch (e) {
//         console.log(e.message)
//     }
// })

import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join("./", ".env") });

import { Telegraf, Markup } from "telegraf";
import { NHentai } from '@shineiichijo/nhentai-ts'

import { SUBSTRING_COUNT } from "./const";
import { TranslateMessage } from "./helpers/TranslateMessage";
import { linkMatch, removeActionMessage } from "./helpers/common";
import { InputMediaPhoto } from "telegraf/typings/core/types/typegram";

const bot = new Telegraf(process.env.TOKEN);
// fuck TS or ts-node-dev :D 
// error TS2339: Property 'getRandom' does not exist on type 'NHentai'.
// what
const nhentai = new NHentai() as NHentai as any

const t = new TranslateMessage();

let actionMessageId: number | null = null;

bot.use((ctx, next) => {
  console.log('ctx logger', ctx.state)
  next()
})

bot.start(async (ctx) => {
  actionMessageId = ctx.update.message.message_id;
  await ctx.reply(t.message("hello"), t.replyMarkup())
});

bot.help( async (ctx) => {
  actionMessageId = ctx.update.message.message_id;
  await ctx.reply(t.message("hello"), t.replyMarkup())
});

bot.hears(/^\d+$/, async ctx => {
  // const res: IDoujinInfo = await nhentai.getDoujin(ctx.message.text)
  // console.log(res)
  ctx.reply('hehe')
})

bot.action("changeLang", async (ctx) =>
  await ctx.editMessageText(t.message("setLang"), t.replyMarkup())
);

bot.command("random", async (ctx) => {
  const doujin = await nhentai.getRandom()

  await ctx.replyWithMediaGroup(
    [
      {
        type: "photo",
        media: doujin.cover,
      },
      ...[1,2,3].map(num => ({ type: "photo", media: doujin.images.pages[num] })) as InputMediaPhoto[]
    ],
  )
  ctx.reply(`<code>${doujin.id}</code>\n\n${doujin.title}\n\nArtists: ${doujin.artists}\n\n${doujin.languages}\n\n[${doujin.tags}]`, {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
      [
        Markup.button.url(
          'url',
          doujin.url
        ),
      ],
    ]),
  })

  ctx.deleteMessage(ctx.update.message.message_id);
  // console.log('hehe', doujin)
  }
);

bot.action(/setLang_+/, async(ctx) => {
  const {
    match: { input },
  } = ctx;

  // @ts-ignore
  const { message_id } = ctx.editMessageText(
    t.message("success", input.substring(SUBSTRING_COUNT.setLang)),
    t.replyMarkup()
  );

  removeActionMessage(ctx, message_id, actionMessageId)
});

bot.on("message", async (ctx) => {
  const {
    message: {
      // from: { username },
      // chat: { id },
      // @ts-ignore
      text,
    },
  } = ctx;

  if (linkMatch(text)) {
    // console.log(linkMatch(text)[1]);
    return;
  }

  // if (/^\d+$/.test(text)) {
  //   console.log(text);
  //   return;
  // }
  await ctx.reply(t.message("hello"), t.replyMarkup());
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

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

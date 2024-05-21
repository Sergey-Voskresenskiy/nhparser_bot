import path from 'path'
import { Doujin, Prettify } from './../helpers/types';
import { NHentai } from "@shineiichijo/nhentai-ts";

import { replyDoujinWithMediaGroup } from "../helpers/replyDoujinWithMediaGroup";
import { linkMatch, removeActionMessage, getTelegraphPostUrl } from "../helpers/common";


type NHOptions = {
  site: "nhentai.net" | "nhentai.to" | "https://nhentai.net" | "https://nhentai.to";
  user_agent?: string;
  cookie_value?: string;
}

// TODO: Get User Agent and Cookies
const user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
const cookie_value = 'cf_clearance=IS25JW9rCO6u90ntIlFNLwt9x0viKkWvlP_PYcr.hlg-1714719797-1.0.1.1-vxDBjcnWCWH5Dg_0eVDBr.w2IrjATyYmBp4aEWdamlVS_OfSPWHA7Vv59jZP9e5.z1HlttjhBcwrobz7vDwhrA'

const image = path.join(__dirname, '../stickers/sticker.webm')

const nhentai = new NHentai({
  site: 'nhentai.net',
  user_agent,
  cookie_value
} as NHOptions) as NHentai as any;

const start = async (ctx): Promise<void> => {
  await ctx.reply(ctx.i18n.t('hello', { ctx }), ctx.getMessages.helloButtons(ctx))
}
const help = async (ctx): Promise<void> => {
  await ctx.reply(ctx.i18n.t('hello', { ctx }), ctx.getMessages.helloButtons(ctx))
}

const getAndCheckDoujin = async (count: number = 1): Promise<Prettify<Doujin>> => {
  let _count: number = 1;

  try {
    let doujin: Prettify<Doujin> = await nhentai.getRandom();

    if (doujin.id === '') {
      if (count <= 5) {
        _count = count + 1;

        return getAndCheckDoujin(_count)
      }
    }

    return doujin
  } catch (error) {
    console.log('getAndCheckDoujin', error)
    return error
  }
}

const random = async (ctx): Promise<void> => {
  let telegraphPostUrl: string;

  try {
    const doujin: Prettify<Doujin> = await getAndCheckDoujin();

    telegraphPostUrl = await getTelegraphPostUrl(doujin)
    doujin.telegraphPostUrl = telegraphPostUrl

    ctx.session.__scenes.state.lastDoujinId = doujin.id
    ctx.session.__scenes.state.doujin = doujin
    ctx.session.__scenes.state.doujin.telegraphPostUrl = telegraphPostUrl

    await replyDoujinWithMediaGroup(doujin, ctx)

  } catch (error) {
    console.log('random', error)
    const { message_id } = await ctx.reply(error.message)
    removeActionMessage(ctx, message_id)
  }
}

const numbers = async (ctx): Promise<void> => {
  const userInput = ctx?.match?.input || linkMatch(ctx?.message?.text)[1]
  let doujin;
  let telegraphPostUrl: string;

  try {
    if (ctx.session.__scenes.state.lastDoujinId === userInput) {
      doujin = ctx.session.__scenes.state.doujin
    } else {
      doujin = await nhentai.getDoujin(userInput);
      telegraphPostUrl = await getTelegraphPostUrl(doujin)
      doujin.telegraphPostUrl = telegraphPostUrl

      ctx.session.__scenes.state.lastDoujinId = doujin.id
      ctx.session.__scenes.state.doujin = doujin
      ctx.session.__scenes.state.doujin.telegraphPostUrl = telegraphPostUrl
    }

    await replyDoujinWithMediaGroup(doujin, ctx)

  } catch (error) {
    console.log('numbers', error)
    const { message_id } = await ctx.reply(error.message)
    removeActionMessage(ctx, message_id)
  }
}

const onMessage = async (ctx): Promise<void> => {
  const {
    message: {
      text,
    },
  } = ctx;

  if (linkMatch(text)) {
    return numbers(ctx)
  }

  await ctx.reply(ctx.i18n.t('understand'));
  await ctx.replyWithSticker({
    source: image,
    filename: 'sticker.webm'
  }, {
    reply_to_message_id: ctx.message.message_id,
    allow_sending_without_reply: true,
  });
}

export { start, help, random, numbers, onMessage }
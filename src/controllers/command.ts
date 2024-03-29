import { Doujin, Prettify } from './../helpers/types';
import { NHentai } from "@shineiichijo/nhentai-ts";

import { replyDoujinWithMediaGroup } from "../helpers/replyDoujinWithMediaGroup";
import { linkMatch, removeActionMessage, getTelegraphPostUrl } from "../helpers/common";

const nhentai = new NHentai({ site: "nhentai.website" }) as NHentai as any;

const start = async (ctx): Promise<void> => {
  await ctx.reply(ctx.i18n.t('hello', { ctx }), ctx.getMessages.helloButtons(ctx))
}
const help = async (ctx): Promise<void> => {
  await ctx.reply(ctx.i18n.t('hello', { ctx }), ctx.getMessages.helloButtons(ctx))
}

const getAndCheckDoujin = async (count: number = 1): Promise<Prettify<Doujin>> => {
  let _count: number = 1;

  try {
    let doujin: Prettify<Doujin>  = await nhentai.getRandom();

    if(doujin.id === '') {
      if(count <= 5) {
        _count = count + 1;

        return getAndCheckDoujin(_count)
      }
    }

    return doujin
  } catch(error) {
      console.log('getAndCheckDoujin', error)
      return error
    }
}

const random = async (ctx): Promise<void> => {
  let telegraphPostUrl: string;

  try {
    const doujin: Prettify<Doujin> = await getAndCheckDoujin();

    telegraphPostUrl =  await getTelegraphPostUrl(doujin)
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
    if(ctx.session.__scenes.state.lastDoujinId === userInput) {
      doujin = ctx.session.__scenes.state.doujin
    } else {
      doujin = await nhentai.getDoujin(userInput);
      telegraphPostUrl =  await getTelegraphPostUrl(doujin)
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
}


export { start, help, random, numbers, onMessage }
import { Doujin } from './../helpers/types';
import { NHentai } from "@shineiichijo/nhentai-ts";

import { replyDoujinWithMediaGroup } from "../helpers/replyDoujinWithMediaGroup";
import { linkMatch, removeActionMessage, getTelegraphPostUrl } from "../helpers/common";

const nhentai = new NHentai({ site: "nhentai.website" }) as NHentai as any;

const start = async ctx => {
  await ctx.reply(ctx.i18n.t('hello', { ctx }), ctx.getMessages.helloButtons(ctx))
}
const help = async ctx  => {
  await ctx.reply(ctx.i18n.t('hello', { ctx }), ctx.getMessages.helloButtons(ctx))
}

const getAndCheckDoujin = async (): Promise<Doujin> => {
  let doujin: Doujin  = await nhentai.getRandom();

  if(doujin.id === '') {
    return getAndCheckDoujin()
  }
  return doujin
}

const random = async ctx => {
  let telegraphPostUrl: string;

  try {
    const doujin = await getAndCheckDoujin();

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

const numbers = async ctx => {
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

const onMessage = async (ctx) => {
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
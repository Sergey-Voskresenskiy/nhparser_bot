import { NHentai } from "@shineiichijo/nhentai-ts";

import { TranslateMessage } from "../helpers/TranslateMessage";
import { replyDoujinWithMediaGroup } from "../helpers/replyDoujinWithMediaGroup";
import { linkMatch, removeActionMessage, getTelegraphPostUrl } from "../helpers/common";

const tm = new TranslateMessage();

const nhentai = new NHentai() as NHentai as any;

const start = async ctx => {
  await ctx.reply(tm.message("hello", ctx.session.__scenes.state.lang), tm.replyMarkup());
  await ctx.deleteMessage(ctx.update.message.message_id);
}
const help = async ctx  => {
  await ctx.reply(tm.message("hello", ctx.session.__scenes.state.lang), tm.replyMarkup());
  await ctx.deleteMessage(ctx.update.message.message_id);
}
const random = async ctx => {
  let telegraphPostUrl: string;

  try {
    const doujin = await nhentai.getRandom();

    telegraphPostUrl =  await getTelegraphPostUrl(doujin)
    doujin.telegraphPostUrl = telegraphPostUrl

    ctx.session.__scenes.state.lastDoujinId = doujin.id
    ctx.session.__scenes.state.doujin = doujin
    ctx.session.__scenes.state.doujin.telegraphPostUrl = telegraphPostUrl

    await replyDoujinWithMediaGroup(doujin, ctx)
  } catch (error) {
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
    if(ctx.update?.message?.message_id) {
      await ctx.deleteMessage(ctx.update?.message?.message_id);
    }
    
    if(ctx.update?.callback_query?.message?.message_id) {
      await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    }

    const { message_id } = await ctx.reply(error.message)
    removeActionMessage(ctx, message_id)
  }
}


const onMessage = async ctx => {
  const {
    message: {
      text,
    },
  } = ctx;


  if (linkMatch(text)) {
    return numbers(ctx)
  }

  // await ctx.reply('mainScene on message');
  // await ctx.deleteMessage(ctx.update.message.message_id);
}


export { start, help, random, numbers, onMessage }
import { NHentai } from "@shineiichijo/nhentai-ts";

import { TranslateMessage } from "../helpers/TranslateMessage";
import { replyDoujinWithMediaGroup } from "../helpers/replyDoujinWithMediaGroup";

const tm = new TranslateMessage();

// fuck TS or ts-node-dev :D
// error TS2339: Property 'getRandom' does not exist on type 'NHentai'.
// what
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
  const doujin = await nhentai.getRandom();
  await replyDoujinWithMediaGroup(doujin, ctx)
}


export { start, help, random }
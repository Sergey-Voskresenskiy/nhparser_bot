
import { removeActionMessage } from "../helpers/common";
import { TranslateMessage } from "../helpers/TranslateMessage";

import { SUBSTRING_COUNT } from "../const";

const tm = new TranslateMessage();

const changeLang = async ctx => {
  if(ctx.update?.message?.message_id) {
    await ctx.deleteMessage(ctx.update?.message?.message_id);
  }
  
  if(ctx.update?.callback_query?.message?.message_id) {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
  }

  await ctx.reply(tm.message("setLang"), tm.replyMarkup())
}

const setLang = async ctx => {
  const {
    match: { input },
  } = ctx;
  ctx.session.__scenes.state.lang = input.substring(SUBSTRING_COUNT.setLang)

  const { message_id } = await ctx.editMessageText(
    tm.message("success", input.substring(SUBSTRING_COUNT.setLang)),
    tm.replyMarkup()
  );

  removeActionMessage(ctx, message_id);
}

export { changeLang, setLang }
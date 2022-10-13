
import { removeActionMessage } from "../helpers/common";
import { TranslateMessage } from "../helpers/TranslateMessage";

import { SUBSTRING_COUNT } from "../const";

const tm = new TranslateMessage();

const changeLang = async ctx => {
  if(typeof ctx.update.message !== 'object') {
    await ctx.editMessageText(tm.message("setLang"), tm.replyMarkup())
  } else {
    await ctx.reply(tm.message("setLang"), tm.replyMarkup())
  }
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
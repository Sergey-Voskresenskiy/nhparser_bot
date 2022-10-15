
import { removeActionMessage } from "../helpers/common";

import { SUBSTRING_COUNT } from "../const";

const changeLang = async ctx => {
  if(ctx.update?.message?.message_id) {
    await ctx.deleteMessage(ctx.update?.message?.message_id);
  }
  
  if(ctx.update?.callback_query?.message?.message_id) {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
  }
  await ctx.reply(ctx.i18n.t("setLang"), ctx.getMessages.switchLangButtons())
}

const setLang = async ctx => {
  const {
    match: { input },
  } = ctx;
  
  ctx.i18n.locale(input.substring(SUBSTRING_COUNT.setLang))  

  const { message_id } = await ctx.editMessageText(ctx.i18n.t("success"))
  removeActionMessage(ctx, message_id);
}

export { changeLang, setLang }
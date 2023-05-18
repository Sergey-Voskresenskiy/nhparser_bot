import { SUBSTRING_COUNT } from "../const";

const changeLang = async ctx => {
  await ctx.reply(ctx.i18n.t("setLang"), ctx.getMessages.switchLangButtons())
}

const setLang = async (ctx): Promise<void> => {
  const {
    match: { input },
  } = ctx;
  
  ctx.i18n.locale(input.substring(SUBSTRING_COUNT.setLang))  

  await ctx.editMessageText(ctx.i18n.t("success"))
}

export { changeLang, setLang }
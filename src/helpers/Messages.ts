const { Markup } = require("telegraf");
import { DoujinFull } from "./types";

export class Messages {

  private doujin: DoujinFull | null;

  switchLangButtons() {
    const buttons = [
      Markup.button.callback("🇬🇧", `setLang_en`),
      Markup.button.callback("🇺🇦", `setLang_ua`),
    ];

    return {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([...buttons]).resize(),
    };
  }

  helloButtons(ctx) {
    const buttons = [
      [
        Markup.button.callback(
          ctx.i18n.t('random'),
          `random`
        ),
      ],
      [
        Markup.button.callback(
          ctx.i18n.t('changeLang'),
          `changeLang`
        ),
        Markup.button.webApp(
          ctx.i18n.t('donate'),
          process.env.DONATE_URL
        )
      ],
    ];
 
    return {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([...buttons]).resize(),
    };
  }

  doujinMessage(doujin: DoujinFull, ctx) {
    this.doujin = doujin

    return ctx.i18n.t('doujinMessage', { doujin: this.doujin })
  }

  doujinMessageButtons(ctx) {
    const buttons = [
      [
        Markup.button.webApp(
          ctx.i18n.t('url'),
          this.doujin.url
        ),
      ],
      [
        Markup.button.webApp(
          ctx.i18n.t('telegra'),
          this.doujin.telegraphPostUrl
        )
      ],
      [
        Markup.button.webApp(
          ctx.i18n.t('donate'),
          process.env.DONATE_URL
        )
      ],
    ];

    return {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([...buttons]).resize(),
    };
  }
}

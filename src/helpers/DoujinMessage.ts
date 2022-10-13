const { Markup } = require("telegraf");

import { Message } from "./Message";

export class DoujinMessage extends Message {
  private doujin;

  message(doujin, lang: string = this.lang) {
    if (lang !== this.lang) this.setLang(lang);
    this.doujin = doujin

    return `<code>${doujin.id}</code>\n\n${doujin.title}\n\nArtists: ${doujin.artists}\n\n${doujin.languages}\n\n[${doujin.tags}]`
  }

  waitMessage(lang: string = this.lang) {
    return this.dictionary.wait[lang]
  }

  replyMarkup() {
    let buttons = [[Markup.button.url("url", this.doujin.url)]];

    return       {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([...buttons]).resize(),
    };
  }
}
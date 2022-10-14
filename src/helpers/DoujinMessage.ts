const { Markup } = require("telegraf");

import { Message } from "./Message";
import { DoujinFull } from "./types";

export class DoujinMessage extends Message {
  private doujin: DoujinFull | null;

  message(doujin: DoujinFull, lang: string = this.lang) {
    if (lang !== this.lang) this.setLang(lang);
   
    this.doujin = doujin

    return `${this.dictionary.id[this.lang]} <code>${doujin.id}</code>\n\n${this.dictionary.title[this.lang]} ${doujin.title}\n\n${this.dictionary.artists[this.lang]} ${doujin.artists}\n\n${this.dictionary.languages[this.lang]} ${doujin.languages}\n\n${this.dictionary.tags[this.lang]} [${doujin.tags}]`
  }

  waitMessage(lang: string = this.lang) {
    return this.dictionary.wait[lang]
  }

  replyMarkup() {
    const buttons = [
      [
        Markup.button.url(
          this.dictionary.url[this.lang],
          this.doujin.url
        ),
      ],
      [
        Markup.button.url(
          this.dictionary.telegra[this.lang],
          this.doujin.telegraphPostUrl
        )
      ],
      [
        Markup.button.url(
          this.dictionary.donate[this.lang],
          process.env.DONATE_URL
        ),
      ],
    ];

    return       {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([...buttons]).resize(),
    };
  }
}
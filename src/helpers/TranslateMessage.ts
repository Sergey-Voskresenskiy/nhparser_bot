import { Message } from "./Message";

const { Markup } = require("telegraf");

export class TranslateMessage extends Message {

  message(dictum: string, lang: string = this.lang): string {
    if (!dictum) throw new Error("Cannot get dictum");
    if (lang !== this.lang) this.setLang(lang);

    this.dictum = dictum;
    
    return this.dictionary[this.dictum][this.lang];
  }

  setDictum(dictum: string): void {
    this.dictum = dictum;
  }

  replyMarkup() {
    let buttons = [];

    switch (this.dictum) {
      case "hello":
        buttons = [
          [
            Markup.button.url(
              this.dictionary.donate[this.lang],
              process.env.DONATE_URL
            ),
          ],
          [
            Markup.button.callback(
              this.dictionary.random[this.lang],
              `random`
            ),
          ],
          [
            Markup.button.callback(
              this.dictionary.changeLang[this.lang],
              `changeLang`
            ),
          ],
        ];
        break;
      case "setLang":
        buttons = [
          Markup.button.callback("Eng", `setLang_en`),
          Markup.button.callback("Urk", `setLang_ua`),
          Markup.button.callback("Rus", `setLang_ru`),
        ];
    }

    return {
      caption: this.dictum,
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([...buttons]),
    };
  }
}

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
          Markup.button.callback("🇬🇧", `setLang_en`),
          Markup.button.callback("🇺🇦", `setLang_ua`),
          Markup.button.callback("🇷🇺", `setLang_ru`),
        ];
        break;
      default:
        break;
    }

    return {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([...buttons]).resize(),
    };
  }
}

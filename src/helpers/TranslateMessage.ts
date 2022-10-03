const { Markup } = require("telegraf");
import { DICTIONARY, DEFAULT_LANG } from "../const";

export class TranslateMessage {
  private lang;
  private dictum;
  private dictionary = DICTIONARY;

  constructor(lang = DEFAULT_LANG) {
    this.setLang(lang);
  }

  message(dictum, lang = this.lang): string {
    if (!dictum) throw new Error("Cannot get dictum");
    if (lang !== this.lang) this.setLang(lang);

    this.dictum = dictum;
    
    return this.dictionary[this.dictum][this.lang];
  }

  setLang(lang) {
    this.lang = lang;
  }

  setDictum(dictum) {
    this.dictum = dictum;
  }

  reply_markup() {
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
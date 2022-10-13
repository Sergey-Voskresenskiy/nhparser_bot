
import { DICTIONARY, DEFAULT_LANG } from "../const";

export class Message {
  lang: string;
  dictum: string;
  dictionary = DICTIONARY;

  constructor(lang: string = DEFAULT_LANG) {
    this.setLang(lang);
  }

  setLang(lang: string): void {
    this.lang = lang;
  }
}

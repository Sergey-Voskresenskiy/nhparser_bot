const DEFAULT_LANG = 'ua'
const SUBSTRING_COUNT = {
  setLang: 8
}
const LINK_REGEX = new RegExp("^(?:https?://)?nhentai.net/g/(\\d+)(?:/|$)");

const DICTIONARY = {
  hello: {
    en: `Hello \n\n❤️❤️❤️\n\nJust send me the "numbers/link" to receive a manga preview message \n\n❤️❤️❤️`,
    ua: `Привіт \n\n❤️❤️❤️\n\nПросто надішліть мені "цифри/посилання", щоб отримати повідомлення з попереднім переглядом манги \n\n❤️❤️❤️`,
    ru: `Привет \n\n❤️❤️❤️\n\nПросто пришлите мне "цифры/ссылку", что бы получить сообщение с предворительным просмотром манги \n\n❤️❤️❤️`,
  },
  donate: {
    en: 'Donate', 
    ua: 'Підтримати', 
    ru: 'Поддержать', 
  },
  changeLang: {
    en: 'Change lang',
    ua: 'Змінити мову',
    ru: 'Изменить язык',
  },
  setLang: {
    en: "Select language",
    ua: "Виберіть мову",
    ru: "Выберите язык"
  },
  success: {
    en: "Success! Language changed",
    ua: "Успіх! Мова змінена",
    ru: "Успех! Язык изменен"
  }
}

export {
  DICTIONARY,
  DEFAULT_LANG,
  SUBSTRING_COUNT,
  LINK_REGEX,
}
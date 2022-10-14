import dictionary from './dictionary.json'

const DICTIONARY = dictionary
const DEFAULT_LANG = 'ua'
const SUBSTRING_COUNT = {
  setLang: 8
}

const LINK_REGEX = new RegExp("^(?:https?://)?nhentai.to/g/(\\d+)(?:/|$)");

export {
  DICTIONARY,
  DEFAULT_LANG,
  SUBSTRING_COUNT,
  LINK_REGEX,
}
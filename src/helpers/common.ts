import { LINK_REGEX } from "../const";

const linkMatch = (text: string): RegExpExecArray => LINK_REGEX.exec(text);

export { linkMatch }
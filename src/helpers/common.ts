import { LINK_REGEX } from "../const";
import { telegraphPost } from "./telegraphPost";

const linkMatch = (text: string): RegExpExecArray => LINK_REGEX.exec(text);

const removeActionMessage = (ctx, messageId: number): void => {
  setTimeout(() => {
    ctx.deleteMessage(messageId);
  }, 2000);
};

const getTelegraphPostUrl= async (doujin) => {
  return await telegraphPost(doujin)
}

const replyPhotoCounts = [1,2,3]

export { linkMatch, removeActionMessage, replyPhotoCounts, getTelegraphPostUrl };

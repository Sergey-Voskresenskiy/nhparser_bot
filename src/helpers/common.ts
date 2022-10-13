import { LINK_REGEX } from "../const";

const linkMatch = (text: string): RegExpExecArray => LINK_REGEX.exec(text);

const removeActionMessage = (ctx, messageId: number): void => {
  setTimeout(() => {
    ctx.deleteMessage(messageId);
  }, 2000);
};

const replyPhotoCounts = [1,2,3]

export { linkMatch, removeActionMessage, replyPhotoCounts };

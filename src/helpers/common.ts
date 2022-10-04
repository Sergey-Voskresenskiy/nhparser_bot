import { LINK_REGEX } from "../const";

const linkMatch = (text: string): RegExpExecArray => LINK_REGEX.exec(text);

const removeActionMessage = (ctx, messageId: number, userActionMessageId: number): void => {
  setTimeout(() => {
    ctx.deleteMessage(messageId);
    ctx.deleteMessage(userActionMessageId);
  }, 2000);
}

export { linkMatch, removeActionMessage }
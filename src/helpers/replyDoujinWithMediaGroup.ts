import { InputMediaPhoto } from "telegraf/typings/core/types/typegram";

import { replyPhotoCounts } from "./common";

const replyDoujinWithMediaGroup = async (doujin, ctx) => {
  const { message_id: waitMessage } = await ctx.reply(ctx.i18n.t('wait'));
  if (doujin) {
    await ctx.replyWithMediaGroup([
      {
        type: "photo",
        media: doujin.cover,
      },
      ...(replyPhotoCounts.map((num) => ({
        type: "photo",
        media: doujin.images.pages[num],
      })) as InputMediaPhoto[]),
    ]);

    await ctx.reply(
      ctx.getMessages.doujinMessage(doujin, ctx),
      ctx.getMessages.doujinMessageButtons(ctx)
    );
  
    if(ctx.update?.message?.message_id) {
      await ctx.deleteMessage(ctx.update?.message?.message_id);
    }

    if(ctx.update?.callback_query?.message?.message_id) {
      await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    }

    await ctx.deleteMessage(waitMessage);
  }

}

export { replyDoujinWithMediaGroup };

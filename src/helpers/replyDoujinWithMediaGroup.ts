import { InputMediaPhoto } from "telegraf/typings/core/types/typegram";

import { replyPhotoCounts } from "./common";
import { DoujinMessage } from "./DoujinMessage";

const dm = new DoujinMessage();

const replyDoujinWithMediaGroup = async (doujin, ctx) => {
  const { message_id: waitMessage } = await ctx.reply(dm.waitMessage(ctx.session.__scenes.state.lang));
  
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
      dm.message(doujin, ctx.session.__scenes.state.lang),
      dm.replyMarkup()
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

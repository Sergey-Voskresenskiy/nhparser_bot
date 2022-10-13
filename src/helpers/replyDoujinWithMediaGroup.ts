import { InputMediaPhoto } from "telegraf/typings/core/types/typegram";

import { replyPhotoCounts } from "./common";
import { DoujinMessage } from "./DoujinMessage";

const dm = new DoujinMessage();

const replyDoujinWithMediaGroup = async (doujin, ctx) => {


  console.log({ctx})

  const { message_id: waitMessage } = await ctx.reply(dm.waitMessage(ctx.session.__scenes.state.lang));
  
  if (doujin) {
    ctx.state.lastDoujin = doujin.id
    await ctx.replyWithMediaGroup([
      {
        type: "photo",
        media: doujin.cover,
      },
      ...(replyPhotoCounts.map((num) => ({
        type: "photo",
        media: doujin.images.pages[num],
        caption: `Page №:${num}`,
      })) as InputMediaPhoto[]),
    ]);

    await ctx.reply(
      dm.message(doujin, ctx.session.__scenes.state.lang),
      dm.replyMarkup()
    );
  
    await ctx.deleteMessage(ctx.update.message.message_id);
    await ctx.deleteMessage(waitMessage);
  }

}

export { replyDoujinWithMediaGroup };

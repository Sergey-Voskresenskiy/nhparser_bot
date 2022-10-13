import { Scenes } from "telegraf";
import { start, help, random } from "../controllers/command"
import { changeLang, setLang } from "../controllers/action"
import { DEFAULT_LANG } from "../const";

import { linkMatch } from "../helpers/common";

interface MainSceneState extends Scenes.SceneSessionData {
  state: {
    lang: string;
  }
}

const mainScene = new Scenes.BaseScene<Scenes.SceneContext<MainSceneState>>('mainScene')

mainScene.use((ctx, next) => {
  if(!ctx.session.__scenes.state.lang) {
    ctx.session.__scenes.state.lang = DEFAULT_LANG
  }

  console.log({ state: ctx.session.__scenes.state });

  return next();
});

mainScene.enter(start)
mainScene.start(start)
mainScene.help(help)

mainScene.command("random", random );
mainScene.command("change_lang", changeLang );

mainScene.action("random", random);
mainScene.action("changeLang", changeLang);
mainScene.action(/setLang_+/, setLang);

mainScene.hears(/^\d+$/, async (ctx) => {
  // const res: IDoujinInfo = await nhentai.getDoujin(ctx.message.text)
  // console.log(res)
  ctx.reply("hehe");
});

mainScene.on("message", async (ctx) => {
  const {
    message: {
      // from: { username },
      // chat: { id },
      // @ts-ignore
      text,
    },
  } = ctx;

  if (linkMatch(text)) {
    // console.log(linkMatch(text)[1]);
    return;
  }

  // if (/^\d+$/.test(text)) {
  //   console.log(text);
  //   return;
  // }
  await ctx.reply('asdasd');
  // await ctx.reply(tm.message("hello"), tm.replyMarkup());
});



export { mainScene, MainSceneState }
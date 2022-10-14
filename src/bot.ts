import { Telegraf, Scenes, session } from "telegraf";

import { mainScene, MainSceneState } from "./controllers/mainScene"

const bot = new Telegraf<Scenes.SceneContext<MainSceneState>>(process.env.TOKEN);
const stage = new Scenes.Stage([mainScene])

const setupBot = () => {
  bot.use(session())
  bot.use(stage.middleware())

  bot.start(ctx => {
    ctx.scene.enter('mainScene');
  });

  bot.on("message", async (ctx) => {
    ctx.scene.enter('mainScene');
  })

  return bot
}

export { setupBot }
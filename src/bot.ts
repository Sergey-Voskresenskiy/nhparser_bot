import path from 'path';
import { Telegraf, Scenes, session } from "telegraf";
import TelegrafI18n from "telegraf-i18n"

import { mainScene } from "./scenes/mainScene"
import { Messages } from "./helpers/Messages";

import { MainSceneState } from 'src/helpers/types';

const i18n = new TelegrafI18n({
  defaultLanguage: 'ua',
  allowMissing: false,
  useSession: true,
  defaultLanguageOnMissing: true,
  directory: path.resolve(__dirname, 'locales')
})

const bot = new Telegraf<Scenes.SceneContext<MainSceneState>>(process.env.TOKEN);
// @ts-ignore
bot.context.getMessages = new Messages()

const stage = new Scenes.Stage([mainScene])

const setupBot = () => {
  bot.use(session())
  bot.use(i18n.middleware())
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
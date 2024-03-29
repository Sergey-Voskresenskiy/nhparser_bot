import path from 'path';
import { Telegraf, Scenes, session } from "telegraf";
import TelegrafI18n from "telegraf-i18n"

import { mainScene } from "./scenes/mainScene"
import { Messages } from "./helpers/Messages";

import { Bot, MainSceneState, Prettify } from './helpers/types';

const i18n: TelegrafI18n = new TelegrafI18n({
  defaultLanguage: 'ua',
  allowMissing: false,
  useSession: true,
  defaultLanguageOnMissing: true,
  directory: path.resolve(__dirname, 'locales')
})

const bot = new Telegraf<Prettify<Bot>>(process.env.TOKEN);

bot.context.getMessages = new Messages()

const stage: Scenes.Stage<Prettify<Scenes.SceneContext<MainSceneState>>, Prettify<Scenes.SceneSessionData>> = new Scenes.Stage([mainScene])

const setupBot = (): Telegraf<Scenes.SceneContext<MainSceneState>> => {
  bot.use(session())
  bot.use(i18n.middleware())
  bot.use(stage.middleware())

  bot.start((ctx): void => {
    ctx.scene.enter('mainScene');
  });

  bot.on("message", async (ctx): Promise<void> => {
    ctx.scene.enter('mainScene');
  })

  return bot
}

export { setupBot }
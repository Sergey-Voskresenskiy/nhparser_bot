import { Scenes } from "telegraf";
import { start, help, random, numbers, onMessage } from "../controllers/command"
import { changeLang, setLang } from "../controllers/action"
import { DEFAULT_LANG } from "../const";
import { MainSceneState } from "src/helpers/types";

const mainScene = new Scenes.BaseScene<Scenes.SceneContext<MainSceneState>>('mainScene')

mainScene.use((ctx, next) => {
  if(!ctx.session.__scenes.state.lang) {
    ctx.session.__scenes.state.lang = DEFAULT_LANG
  }
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

mainScene.hears(/^\d+$/, numbers);

mainScene.on("message", onMessage);



export { mainScene, MainSceneState }
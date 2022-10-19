import { Scenes } from "telegraf";
import { start, help, random, numbers, onMessage } from "../controllers/command"
import { changeLang, setLang } from "../controllers/action"
import { MainSceneState } from "../helpers/types";

const mainScene = new Scenes.BaseScene<Scenes.SceneContext<MainSceneState>>('mainScene')

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



export { mainScene }
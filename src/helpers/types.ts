import { IDoujinInfo } from "@shineiichijo/nhentai-ts/dist/Types";
import { Scenes } from "telegraf";
import { Messages } from "./Messages";

export interface DoujinFull extends IDoujinInfo {
  telegraphPostUrl: string;
}

export interface MainSceneState extends Scenes.SceneSessionData {
  state: {
    lang: string;
    lastDoujinId: number | string;
    doujin: DoujinFull;
  }
  getMessages: Messages;
}

export interface Doujin extends IDoujinInfo {
  telegraphPostUrl: string
}
import { IDoujinInfo } from "@shineiichijo/nhentai-ts/dist/Types";
import { Scenes } from "telegraf";
import { Messages } from "./Messages";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export interface Bot extends Scenes.SceneContext<MainSceneState> {
  getMessages: Messages;
}

export interface DoujinFull extends IDoujinInfo {
  telegraphPostUrl: string;
}

export interface Doujin extends IDoujinInfo {
  telegraphPostUrl: string
}

export interface MainSceneState extends Scenes.SceneSessionData {
  state: {
    lang: string;
    lastDoujinId: number | string;
    doujin: DoujinFull;
  }
  getMessages: Messages;
}

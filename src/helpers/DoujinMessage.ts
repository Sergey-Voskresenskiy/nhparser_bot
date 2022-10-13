export class DoujinMessage {
  private doujin;

  constructor(doujin) {
    this.doujin = doujin
  }

  message() {
    return `${this.doujin.title}\n\n`
  }
}
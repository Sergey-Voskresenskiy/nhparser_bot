const axios = require('axios');
import { parse } from 'node-html-parser';

async function scraping (number) {
  const startImg = /data-src="/
  const reg = /(\<(\/?[^>]+)>)/g

  const url = `${process.env.URL_DEFAULT}${number}`
  const { data } = await axios.get(url)

  const imgHTML = parse(data)
    .querySelector('#cover a img')
    .toString()
    .split(startImg)
    .pop();

  const imgUrl = imgHTML.slice(0, imgHTML.indexOf('\"'))
  const titleHtmlBefore = parse(data).querySelector('#info .title .before').toString().replace(reg, '')
  const titleHtmlPretty = parse(data).querySelector('#info .title .pretty').toString().replace(reg, '')
  const titleHtmlAfter = parse(data).querySelector('#info .title .after').toString().replace(reg, '')
  let tags = parse(data)
    .querySelectorAll("#tags > div:nth-child(3) > .tags .name")
    .map(tag => tag.rawText)
  return {
    img: imgUrl,
    title: `${titleHtmlBefore} ${titleHtmlPretty} ${titleHtmlAfter}`,
    url,
    tags
  };
}

async function getLatestNum () {
  const start = '<a href="/g/'
  const { data } = await axios.get(`${process.env.URL_MAIN}`)
  const temp = parse(data)
    .querySelector('#content .gallery .cover')
    .toString()
    .split(start)
    .pop();
  const num = randomInteger(0, Number(temp.slice(0, temp.indexOf('/"'))))
  return num
}

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

async function sendThis(bot, id, img, title, url, tags ){
  const { message_id } = await bot.sendMessage(id, '💖 *Please wait!* 💖', { parse_mode: 'Markdown' })
  
  const waitTimeout = setTimeout(async () => {
    const { from: { id: done } } = await bot.sendPhoto(id, img, {
      parse_mode: 'markdown',
      caption: `${title}.\n\n*Tags: * ${tags}`,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Open on site',
              url
            },
          ]
        ]
      }
    });
    if (done) bot.deleteMessage(id, message_id)
    clearTimeout(waitTimeout)
  }, 3000)
}

export {
  scraping,
  randomInteger,
  sendThis,
  getLatestNum
}
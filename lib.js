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

  return {
    img: imgUrl,
    title: `${titleHtmlBefore} ${titleHtmlPretty} ${titleHtmlAfter}`,
    url
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
  console.log(num);
  return num
}

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function sendThis(bot,id, img, title, url ){
  bot.sendPhoto(id, img, {
    caption: `${title}`,
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
}

export {
  scraping,
  randomInteger,
  sendThis,
  getLatestNum
}
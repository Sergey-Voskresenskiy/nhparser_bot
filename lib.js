import axios from 'axios';
import pkg from 'node-html-parser';
import Telegraph from 'telegra.ph'

const telegraph = new Telegraph("")
const {parse} = pkg;
import nhentai from 'nhentai';

const API_Nhentai = new nhentai.API();

function cacheAnswers(fn, cacheTime = 1000 * 60 * 5) {
    const memoCache = new Map();
    return (...args) => {
        const memoKey = JSON.stringify(args);
        if (memoCache.has(memoKey)) {
            const entryDate = memoCache.get(memoKey)?.time;
            const diff = Date.now() - entryDate?.getTime();
            if (diff <= cacheTime) return memoCache.get(memoKey)?.result;
        }
        const res = fn(...args);
        if (res instanceof Promise) {
            return res.then(r => {
                memoCache.set(memoKey, {time: new Date(), result: r});
                return res;
            });
        } else {
            memoCache.set(memoKey, {time: new Date(), result: res});
            return res;
        }
    };
}

const getCachedAxios = cacheAnswers(async (url) => await axios.get(url))

let Author = null

async function _initTelegraPh() {
    // TODO: create only one account :D
    const {access_token, auth_url} = await telegraph.createAccount("showNH")
    telegraph.token = access_token
    Author = auth_url
}

await _initTelegraPh()

const scraping = cacheAnswers(async (number) => {
    const {
        cover: {url: coverImage},
        thumbnail: {url: thumbnailImage},
        titles,
        pages,
        url,
        tags,
        id
    } = await API_Nhentai.fetchDoujin(number)

    const images = pages.map(p => p.url)
    const content = [
        {
            tag: 'a',
            'attrs': {
                'href': url
            },
            children: [`Eng:\n${titles.english}\nJapanese:\n${titles.japanese}.\n\n`]
        },
        {
            tag: 'hr',
        },
        {
            tag: 'i',
            children: [`Tags: ${tags}`]
        },
        {
            tag: 'hr',
        },
    ]

    images.forEach(img => {
        content.push({
            tag: 'img',
            'attrs': {
                'src': img
            },
        })
    })
    const {url: telegraphUrl} = await telegraph.createPage(titles.pretty, content, 'showNH', Author, false)
    return {
        id,
        img: coverImage ? coverImage : thumbnailImage,
        title: titles,
        url,
        tags: tags.all.map(tag => tag.name).join(', '),
        images,
        telegraphUrl
    }
})

async function getLatestNum() {
    const start = '<a href="/g/'
    const {data} = await getCachedAxios(`${process.env.URL_MAIN}`)
    const temp = parse(data)
        .querySelector('#content .gallery .cover')
        .toString()
        .split(start)
        .pop();
    return randomInteger(0, Number(temp.slice(0, temp.indexOf('/"'))))
}

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

async function sendThis(bot, id, img, title, url, tags, telegraphUrl) {
    const {from: {id: done}} = await bot.sendPhoto(id, img, {
        parse_mode: 'markdown',
        caption: `*Eng:*\n${title.english}\n\n*Japanese:*\n${title.japanese}.\n\n*Tags:*\n${tags}`,
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Open on site',
                        url
                    },
                ],
                [
                    {
                        text: 'Open on telegra.ph',
                        url: String(telegraphUrl)
                    }
                ]
            ]
        }
    });
    return {done}
}

async function getContentToInlineQuery(id, img, title, url, tags, telegraphUrl) {
    return [
        {
            id: id.toString(),
            type: 'photo',
            title: title.pretty,
            parse_mode: 'markdown',
            caption: `*Eng:*\n${title.english}\n\n*Japanese:*\n${title.japanese}.\n\n*Tags:*\n${tags}`,
            photo_url: img,
            thumb_url: img,
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Open on site',
                            url
                        },
                    ],
                    [
                        {
                            text: 'Open on telegra.ph',
                            url: telegraphUrl
                        }
                    ]
                ]
            }

        }]
}

export {
    scraping,
    getContentToInlineQuery,
    randomInteger,
    sendThis,
    getLatestNum
}

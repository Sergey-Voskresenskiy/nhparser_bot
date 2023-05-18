import Telegraph from 'telegra.ph'
import { DoujinFull } from './types'
const telegraph = new Telegraph(process.env.ACCESS_TOKEN)

const telegraphPost = async (doujin: DoujinFull): Promise<string> => {
  const content = [
    {
      tag: "a",
      attrs: {
        href: doujin.url,
      },
      children: [`Open on site`],
    },
    {
      tag: "hr",
    },
    {
      tag: "p",
      children: [`Authors/s: ${doujin.artists}`],
    },
    {
      tag: "p",
      children: [`languages: ${doujin.languages}`],
    },
    {
      tag: "p",
      children: [`categories: ${doujin.categories}`],
    },
    {
      tag: "i",
      children: [`Tags: ${doujin.tags}`],
    },
  ];

  doujin.images.pages.forEach(img => {
      content.push({
          tag: 'img',
          'attrs': {
              'src': img
          } as any,
      })
  })

  const { url: telegraphUrl } = await telegraph.createPage(doujin.title, content as any, 'showNH', process.env.AUTHOR_URL, false)
  return telegraphUrl;
}

export {
  telegraphPost
}
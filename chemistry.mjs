import * as cheerio from 'cheerio' 
import fs from 'fs'

import {getPage, getDynamicPage, getMonthMap} from './utils.mjs'

async function getIssues() {
    let hrefs = []
    for(let i = 2024; i >= 1965; i--) {
        try {
            let html = await getDynamicPage("https://www.hij.ru/read/issues/" + i + "/", 'img.content_img')
            const $ = cheerio.load(html)
            let $a = $('div.item a')
            for(let j = 0; j < $a.length; j++) {
                hrefs.push("https://www.hij.ru" + $a.eq(j).attr('href'))
            }
        } catch(e) {
            //console.log("ПРОБЛЕМЫ С " + "https://www.hij.ru/read/issues/" + i + "/")
        }
    
    }

    return hrefs
}

async function parseInfo(url) {
    const html = await getDynamicPage(url, '.magazine_articles__name.magazine_articles__name_1')
    const $ = cheerio.load(html)
    const $title = $('.magazine_articles__name.magazine_articles__name_1')
    const $authors = $('.magazine_articles__author')
    const $annotation = $('.magazine_articles__text')
    const $category = $('.magazine_articles__badge')

    let info = []
    for(let i = 0; i < $title.length; i++) {
        info.push(
            {
                "title": $title.eq(i).text().replace('\n', '').replace('\t', '').trim(),
                "authors": $authors.eq(i).text().replace('\n', '').replace('\t', '').trim(),
                "annotation": $annotation.eq(i).text().replace('\n', '').replace('\t', '').trim(),
                "category": $category.eq(i).text().replace('\n', '').replace('\t', '').trim(),
                "date": url.split('/')[url.split('/').length - 3] + "." + url.split('/')[url.split('/').length - 2],
                "url": url
            }
        )
    }
    
    return info;
} 

export default async function getInfo() {
    const hrefs = await getIssues()

    const file_path = 'Chemistry.json'
    const write_stream = fs.createWriteStream(file_path, { flags: 'a'})
    write_stream.write("{\n\"info\":\n[\n")

    for(let i = 0; i < hrefs.length; i++) {
        try {
            const line = '\n' + JSON.stringify(await parseInfo(hrefs[i]), null, 2)
            if(i != 0) {write_stream.write(",")}
            write_stream.write(line)
            console.log('CHEM ' + i + '/' + hrefs.length)
        } catch(e) {
            console.log(e.message)
        }
    }

    write_stream.write("\n]\n}")
    write_stream.end()
    console.log("Chemisrty finish") 
}
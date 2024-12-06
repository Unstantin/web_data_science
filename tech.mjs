import needle from 'needle'
import * as cheerio from 'cheerio' 
import fs from 'fs'

import {getPage, getDynamicPage, getMonthMap} from './utils.mjs'

export default async function getInfo() {
    let base_url = "https://journals.ioffe.ru/journals/3"
    let html = await getDynamicPage(base_url, 'span.issue_menu_item a')
    let $ = cheerio.load(html)

    let hrefs = []
    $('span.issue_menu_item a').each((index, element) => {
        hrefs.push($(element).attr('href'))
    })
    
    const file_path = 'Tech.json'
    const write_stream = fs.createWriteStream(file_path, { flags: 'a'})
    let i = 0
    write_stream.write("{\n\"info\":\n[\n")
    
    for(let element of hrefs) {
        const line = '\n' + JSON.stringify(await parseInfo('https://journals.ioffe.ru' + element), null, 2)
        if(i != 0) {write_stream.write(",")}
        write_stream.write(line)
        console.log('TECH ' + i + "/" + hrefs.length)
        i++
    }
    write_stream.write("\n]\n}")
    write_stream.end()
    console.log("Tech finish") 
}

async function parseInfo(url) {
    let html = await getDynamicPage(url, '.issue_art_authors')
    let $ = cheerio.load(html)

    let $authors = $('.issue_art_authors')
    let $titles = $('.issue_art_title')
    let $pages = $('.issue_art_page')
    let $year = $('.issue_title')

    let info = []
    for(let i = 0; i < $authors.length; i++) {
        info.push(
            {
                "title": $titles.eq(i).text().replace('\n', '').replace('\t', '').trim(),
                "authors": $authors.eq(i).text().replace('\n', '').replace('\t', '').trim(),
                "pages": $pages.eq(i).text().replace('\n', '').replace('\t', '').trim(),
                "year": $year.eq(0).text().split(",")[1].trim(),
                "url": url
            }
        )
    }

    return info
}
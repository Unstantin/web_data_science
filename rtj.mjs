import * as cheerio from 'cheerio' 
import fs from 'fs'

import {getPage, getDynamicPage, getMonthMap} from './utils.mjs'

export default async function getInfo() {
    const html = await getDynamicPage("https://www.rtj-mirea.ru/jour/issue/archive", '#issue')
    const $ = cheerio.load(html)
    let $issues = $('#issue h4 a')

    let hrefs = []
    $issues.each((index, element) => {
        hrefs.push($(element).attr('href'))
    })
    
    const file_path = 'RTJ.json'
    const write_stream = fs.createWriteStream(file_path, { flags: 'a'})
    let i = 0
    write_stream.write("{\n\"info\":\n[\n")
    for(let element of hrefs) {
        try {
            const line = '\n' + JSON.stringify(await parseInfo(element), null, 2)
            if(i != 0) {write_stream.write(",")}
            write_stream.write(line)
            console.log('RTJ ' + i + "/" + hrefs.length)
        } catch(e) {
            console.log(e)
        }
        i++;
    }
    write_stream.write("\n]\n}")
    write_stream.end()
    console.log("RTJ finish") 
}

async function parseInfo(url) {
    const html = await getDynamicPage(url, '.issueArticle .meta .title')
    const $ = cheerio.load(html)
    const $title = $('.issueArticle .meta .title')
    const $authors = $('.authors')
    const $annotation = $('.issue-abstract')
    const $pages = $('.issueArticle .meta .pages')
    const $year = $('div.tocArticle .title')

    let info = []
    for(let i = 0; i < $title.length; i++) {
        let authors = ""
        $authors.children().each((index, element) => {
            authors += $(element).text().replace('\n', '').replace('\t', '').trim() + " "
        })
        info.push(
            {
                "title": $title.eq(i).text().replace('\n', '').replace('\t', '').trim(),
                "authors": authors,
                "annotation": $annotation.eq(i).text().replace('\n', '').replace('\t', '').trim(),
                "pages": $pages.eq(i).text().replace('\n', '').replace('\t', '').trim(),
                "year": $year.eq(0).text().slice(-5, -1),
                "url": url
            }
        )
    }

    return info
}
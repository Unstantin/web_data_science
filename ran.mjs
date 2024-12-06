import * as cheerio from 'cheerio' 
import fs from 'fs'

import {getPage, getDynamicPage, getMonthMap} from './utils.mjs'


export default async function getInfo() {
    let base_url = "https://sciencejournals.ru/list-issues/vestnik"
    let html = await getDynamicPage(base_url, 'li a')
    let $ = cheerio.load(html)

    let hrefs = []
    $('.list_issues.mb-5 li a').each((index, element) => {
        hrefs.push($(element).attr('href'))
    })
    
    const file_path = 'RAN.json'
    const write_stream = fs.createWriteStream(file_path, { flags: 'a'})
    let i = 0
    write_stream.write("{\n\"info\":\n[\n")
    
    for(let element of hrefs) {
        const line = '\n' + JSON.stringify(await parseInfo('https://sciencejournals.ru' + element), null, 2)
        if(i != 0) {write_stream.write(",")}
        write_stream.write(line)
        console.log('RAN ' + i + "/" + hrefs.length)
        i++
    } 
    write_stream.write("\n]\n}")
    write_stream.end()
    console.log("RAN finish") 
}

async function parseInfo(url) {
    let html = await getDynamicPage(url, '.title')
    let $ = cheerio.load(html)

    let $title = $('span.title a')
    let $authors = $('.col-12.col-md-10 i')
    let $pages = $('.col-12.col-md-2.text-center')
    let $year = $('h6.text-center.mb-2')
    
    let links_for_more_info = $('.link-article.mr-3')
    let more_info = []
    for(let element of links_for_more_info) {
        let link = 'https://sciencejournals.ru' + $(element).attr('href')
        more_info.push(await parseMoreInfo(link))
    }

    let info = [];
    for (let i = 0; i < $title.length; i++) {
        info.push({
            "title": $title.eq(i).text().replace('\n', '').replace('\t', '').trim(),
            "authors": $authors.eq(i).text().replace('\n', '').replace('\t', '').trim(),
            "pages": $pages.eq(i).text().replace('\n', '').replace('\t', '').trim(),
            "annotation": more_info[i] && more_info[i].annotation ? more_info[i].annotation.replace('\n', '').replace('\t', '').trim() : null,
            "doi": more_info[i] && more_info[i].doi ? more_info[i].doi.replace('\n', '').replace('\t', '').trim() : null,
            "year": $year.eq(0).text().split(',')[2].trim(),
            "url": url
        });
    }

    return info
}

async function parseMoreInfo(url) {
    let html = await getDynamicPage(url, 'div')
    let $ = cheerio.load(html)

    let $DOI = $('.list-inline-item.small.px-3')
    let $annotation = $('.tab-pane.active.show')

    let more_info = {
        "doi": $DOI.text(),
        "annotation": $annotation.text()
    }

    return more_info
}











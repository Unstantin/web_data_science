import needle from 'needle'
import * as cheerio from 'cheerio' 
import fs from 'fs'

import {getPage, getDynamicPage, getMonthMap} from './utils.mjs'

async function parseInfo(url) {
    const html = await getPage(url)

    const $ = cheerio.load(html)
    const $title = $('.article__title')
    const $authors = $('.article-authors-list-for-old-issues')
    const $doi = $('.article-spec__link')
    const $tags = $('.article-spec__type')
    const $dates = $('.article-spec .article-spec__rows:nth-child(3) .article-spec__item .article-spec__value')

    let info = []
    for(let i = 0; i < $title.length; i++) {
        info.push(
            {
                "title": $title.eq(i).text(),
                "authors": $authors.eq(i).text(),
                "doi": $doi.eq(i).text(),
                "tags": $tags.eq(i).text(),
                "date": $dates.eq(i).text(),
                "url": url
            }
        )
    }

    return info
}

export default async function getInfo() {
    const base_url = 'https://jae.cifra.science/archive/'

    const month_map = getMonthMap()
    let releases_names = []
    for(let i = 2016; i <= 2024; i++) {
        const response = await needle(
            "get",
            "https://jae.cifra.science/api/sites/6/issues/short/?year=" + i + "&state=3"
        )

        response.body.results.forEach((element) => { 
            releases_names.push(element.number_in_year + '-' + element.general_number + '-' + element.year + '-' + month_map.get(element.month)) 
        })
    }
    
    const file_path = 'JoAnE.json'
    const write_stream = fs.createWriteStream(file_path, { flags: 'a'})
    let i = 0
    write_stream.write("{\n\"info\":\n[\n")
    for(let element of releases_names) {
        const line = '\n' + JSON.stringify(await parseInfo(base_url + element), null, 2)
        if(i != 0) {write_stream.write(",")}
        write_stream.write(line)
        console.log('JOANE ' + i + '/' + releases_names.length)
        i++
    }
    write_stream.write("\n]\n}")
    write_stream.end()
    console.log("finish JoAnE")
}
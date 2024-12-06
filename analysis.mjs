import fs from 'fs'

export default function analysis() {
    console.log("ANALYSIS")
    let paths = ['Tech.json', 'JoAnE.json', 'RAN.json', 'RTJ.json', 'Chemistry.json']
    let fields = [
        ["title", "authors", "pages", "year", "url"],
        ["title", "authors", "doi", "tags", "date", "url"],
        ["title", "authors", "pages", "annotation", "doi", "year", "url"],
        ["title", "authors", "annotation", "pages", "year", "url"],
        ["title", "authors", "annotation", "category", "date", "url"]
    ]

    let trash_words = ["без", "для", "как", "или", "что", "при", "the", "это"]
    let trash_set = new Set()
    trash_words.forEach((element) => {
        trash_set.add(element)
    })

    for(let i = 0; i < fields.length; i++) {
        console.log(paths[i])
        const fileContent = fs.readFileSync(paths[i], 'utf8')
        const data = JSON.parse(fileContent)
        let map_count_words = new Map()
        let map_count_nulls = new Map()
        for(let j = 0; j < fields[i].length; j++) {
            map_count_nulls[fields[i][j]] = 0
        }
        let count = 0
        data.info.forEach((issue, index) => {
            issue.forEach((element, index) => {
                for(let j = 0; j < fields[i].length; j++) {
                    if(element[fields[i][j]] == null || element[fields[i][j]] == "" || element[fields[i][j]] == " ") {
                        map_count_nulls[fields[i][j]] = map_count_nulls[fields[i][j]] + 1
                    }
                }
                count++
                element.title.split(' ').forEach((word, index) => {
                    let clear_word = word.trim().toLowerCase()
                    if(!trash_set.has(clear_word)) {
                        if(clear_word.length > 2) {
                            if(!map_count_words.has(clear_word)) {
                                map_count_words.set(clear_word, 1)
                            } else {
                                map_count_words.set(clear_word, map_count_words.get(clear_word) + 1)
                            }
                        }
                    }
                })
            })
        })

        const frequencyOfWords = Array.from(map_count_words.entries()).sort((a, b) => {
            return b[1] - a[1];
        });
        console.log(frequencyOfWords.slice(0, 10))
        console.log("пропуски: ", map_count_nulls)
        console.log("count: ", count)
        console.log('\n')
    }
}

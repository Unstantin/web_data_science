import needle from 'needle'
import puppeteer from 'puppeteer'

async function getPage(url) {
    const response = await needle(
        "get",
        url
    )
    
    return response.body
}

async function getDynamicPage(url, needed_selector) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    });
    await page.goto(url, { timeout: 60000, waitUntil: 'load' });
    await page.waitForSelector(needed_selector);
    const content = await page.content();
    await browser.close();
    
    return content
}

function getMonthMap() {
    let month_map = new Map()
    month_map.set(1, 'january')
    month_map.set(2, 'february')
    month_map.set(3, 'march')
    month_map.set(4, 'april')
    month_map.set(5, 'may')
    month_map.set(6, 'june')
    month_map.set(7, 'july')
    month_map.set(8, 'august')
    month_map.set(9, 'september')
    month_map.set(10, 'october')
    month_map.set(11, 'november')
    month_map.set(12, 'december')
    return month_map
}

export { getPage, getDynamicPage, getMonthMap}
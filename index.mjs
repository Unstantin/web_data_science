import ranInfo from './ran.mjs'
import techInfo from './tech.mjs'
import rtjInfo from './rtj.mjs'
import chemistryInfo from './chemistry.mjs'
import joaneInfo from './joane.mjs'
import analysis from './analysis.mjs'
import copyAllInfo from './copy_to_db.mjs'


async function getAllInfo() {
    await new Promise(resolve => {setTimeout(() => {console.log("TIMESET"); resolve()}, 3000 )})
    /*
    await Promise.allSettled([
        new Promise(() => {ranInfo()}),
        new Promise(() => {techInfo()}),
        new Promise(() => {chemistryInfo()}),
        new Promise(() => {rtjInfo()}),
        new Promise(() => {joaneInfo()}),
    ]) */
}

await getAllInfo()

analysis()
await copyAllInfo()

process.exit()

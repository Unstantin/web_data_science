import fs from 'fs'
import { DataTypes } from 'sequelize'
import s from './db.mjs'

async function copyChemistry() {
  await s.authenticate()
  await s.sync()
  
  const Chemistry = s.define(
    'papers_chemistry',
    {
      title: DataTypes.STRING,
      authors: DataTypes.STRING,
      annotation: DataTypes.TEXT,
      category: DataTypes.STRING,
      date: DataTypes.STRING,
      url: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  )
  await s.sync()

  let json_plain = fs.readFileSync('Chemistry.json')

  let json = JSON.parse(json_plain).info
  let count = 0
  for(let i = 0; i < json.length; i++) {
    for(let j = 0; j < json[i].length; j++) {
      count++;
      let el = json[i][j]
      let paper = await Chemistry.create(
        {
          title: el.title, 
          authors: el.authors,
          annotation: el.annotation,
          category: el.category,
          date: el.date,
          url: el.url
        }
      )
    }
  }
  console.log(count)
}

async function copyJoAnE() {
  await s.authenticate()
  await s.sync()

  const Joane = s.define(
    'papers_joane',
    {
      title: DataTypes.STRING,
      authors: DataTypes.STRING,
      doi: DataTypes.STRING,
      tags: DataTypes.STRING,
      date: DataTypes.STRING,
      url: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  )
  await s.sync()

  let json_plain = fs.readFileSync('JoAnE.json')

  let json = JSON.parse(json_plain).info
  let count = 0
  for(let i = 0; i < json.length; i++) {
    for(let j = 0; j < json[i].length; j++) {
      count++;
      let el = json[i][j]
      await Joane.create(
        {
          title: el.title, 
          authors: el.authors,
          doi: el.doi,
          tags: el.tags,
          date: el.date,
          url: el.url
        }
      )
    }
  }
  console.log(count)
}

async function copyRTJ() {
  await s.authenticate()
  await s.sync()

  const RTJ = s.define(
    'papers_rtj',
    {
      title: DataTypes.STRING,
      authors: DataTypes.TEXT,
      annotation: DataTypes.TEXT,
      pages: DataTypes.STRING,
      year: DataTypes.INTEGER,
      url: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  )
  await s.sync()

  let json_plain = fs.readFileSync('RTJ.json')

  let json = JSON.parse(json_plain).info
  let count = 0
  for(let i = 0; i < json.length; i++) {
    for(let j = 0; j < json[i].length; j++) {
      count++;
      let el = json[i][j]
      await RTJ.create(
        {
          title: el.title, 
          authors: el.authors,
          annotation: el.annotation,
          pages: el.pages,
          year: el.year,
          url: el.url
        }
      )
    }
  }
  console.log(count)
}

async function copyTech() {
  await s.authenticate()
  await s.sync()

  const Tech = s.define(
    'papers_tech',
    {
      title: DataTypes.TEXT,
      authors: DataTypes.TEXT,
      pages: DataTypes.STRING,
      year: DataTypes.INTEGER,
      url: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  )
  await s.sync()

  let json_plain = fs.readFileSync('Tech.json')

  let json = JSON.parse(json_plain).info
  let count = 0
  for(let i = 0; i < json.length; i++) {
    for(let j = 0; j < json[i].length; j++) {
      count++;
      let el = json[i][j]
      await Tech.create(
        {
          title: el.title, 
          authors: el.authors,
          pages: el.pages,
          year: el.year,
          url: el.url
        }
      )
    }
  }
  console.log(count)
}

async function copyRAN() {
  await s.authenticate()
  await s.sync()

  const Tech = s.define(
    'papers_ran',
    {
      title: DataTypes.TEXT,
      authors: DataTypes.TEXT,
      pages: DataTypes.STRING,
      annotation: DataTypes.TEXT,
      doi: DataTypes.STRING,
      year: DataTypes.INTEGER,
      url: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  )
  await s.sync()

  let json_plain = fs.readFileSync('RAN.json')

  let json = JSON.parse(json_plain).info
  let count = 0
  for(let i = 0; i < json.length; i++) {
    for(let j = 0; j < json[i].length; j++) {
      count++;
      let el = json[i][j]
      await Tech.create(
        {
          title: el.title, 
          authors: el.authors,
          pages: el.pages,
          annotation: el.annotation,
          doi: el.doi,
          year: el.year,
          url: el.url
        }
      )
    }
  }
  console.log(count)
}

export default async function copyAllInfo() {
  await copyChemistry()
  await copyJoAnE()
  await copyRTJ()
  await copyTech()
  await copyRAN()
  
  s.close()
}




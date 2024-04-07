import express from 'express'
import dotenv from 'dotenv'
import Fuse from 'fuse.js'
import infoDB from './Database/eggs_assortment.json' with {type: 'json'}
dotenv.config()

const fuseOptions = {
  threshold: 0.4,
  keys: [
    "Breed", 
    "Category",
    "Species",
    "Keywords"
  ]
}

const fuseOptionsAll = {
  threshold: 1,
  keys: [
    "Breed",
    "Species"
  ]
}

const fuse = new Fuse(infoDB, fuseOptions)
const fuseAll = new Fuse(infoDB, fuseOptionsAll )


  

export function getInfoFromDB (searchPattern) {
   
  if (!searchPattern){
     const result = fuseAll.search({
      $or: [{ Species: "Кури" }, {Species: "Індики"}, {Species: "Качки"}, {Species: "Гуси"}]
    })
    return result
  }
  else {
    return fuse.search(searchPattern) }
}



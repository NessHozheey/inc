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

const fuse = new Fuse(infoDB, fuseOptions)

console.log(fuse.search('лівонскеа'))
console.log('------------------')
let fuseDB = fuse.search('кура')

  

export async function getInfoFromDB (searchPattern) {
   if (!searchPattern) return infoDB 
  else return fuse.search(searchPattern)



}



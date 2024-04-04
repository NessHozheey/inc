import express from 'express'
import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST_A,
  user: process.env.MYSQL_USER_A,
  password: process.env.MYSQL_PASSWORD_A,
  database: process.env.MYSQL_DATABASE_A
}).promise();




export let sqlBasic = `
select ImageSRC,
 info.id,
 Breed,
 info.TypeID,
 cli.Country,
 cli.Price,
 Category
 from eggs_info info join forclient_details cli 
 WHERE info.TypeID = cli.TypeID 
 `

export async function getInfoFromDB(term) {
    if (!term) {
    let [rows] = await pool.query(sqlBasic)
    return rows
    }
    

    let term1 = `.*${term}.*`
    let [rows] = await pool.query(`
    select ImageSRC,
      info.id,
      Breed,
      info.TypeID,
      cli.Country,
      cli.Price,
      Category,
      cli.Species,
      Keywords
      from eggs_info info join forclient_details cli 
      WHERE info.TypeID = cli.TypeID AND (Breed REGEXP ? OR Keywords REGEXP ? OR Species REGEXP ? OR Category REGEXP ? )  
    `, [term1, term1, term1, term1])
    return rows
  }

  
  
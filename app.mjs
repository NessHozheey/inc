import express from 'express'
import nodemailer from 'nodemailer'
import mysql from 'mysql2'
import path from 'path'
import {pool, sqlBasic, getInfoFromDB} from './db.mjs'
import  http  from 'http'
import dotenv from 'dotenv'
dotenv.config()
const app = express();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ENV_MAIL,
    pass: process.env.ENV_PASS
  },
  tls: {rejectUnauthorized: false}
})
async function sendOrder(Lastname, Firstname, Tel, City, Postal, Order) {

  let info = await transporter.sendMail({
    from: `${process.env.FROM} <${process.env.ENV_MAIL}>`,
    to: process.env.ENV_PRO,
    subject: `*** Нове замовлення ${new Date().toLocaleString()} ***`,
    html: `
     <h1> Прізвище: ${Lastname} </h1>
     <h1> Ім'я: ${Firstname} </h1>
     <h1> Телефон: ${Tel} </h1>
     <h1> Місто: ${City} </h1>
     <h1> Пошта: №${Postal} </h1>
     <p> ---------------- </p>
     <h2> ${Order} </h2>`
  })

  console.log(info.messageId)
}

/*async function testSend() {
  let info = await transporter.sendMail({
    from: `${process.env.FROM} <${process.env.ENV_MAIL}>`,
    to: process.env.ENV_PRO,
    subject: 'test',
    html: 'test'
  })

  return info.messageId
}*/


app.set('view engine', 'pug');
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))



app.get('/', async (req, res) => {
  res.render('index')
})


app.get('/assortment', async(req, res) => {
  let term = req.query.search || req.query.sorter
  let infoDB = await getInfoFromDB(term)
  res.render('assortment', {
    infoDB
  })
})

app.get('/checkout', async(req,res) => {
  res.render('checkout')
})

app.post('/checkout', async(req,res) => {
  const {Lastname} = req.body
  const {Firstname} = req.body
  const {Tel} = req.body
  const {City} = req.body
  const {Postal} = req.body
  const {order} = req.body

  sendOrder(Lastname, Firstname, Tel, City, Postal, order)
  res.render('checkout-success')
})

let port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`started on ${port}`)
});

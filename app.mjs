import express from 'express'
import nodemailer from 'nodemailer'
import mysql from 'mysql2'
import path from 'path'
import {getInfoFromDB} from './db.mjs'
import  http  from 'http'
import dotenv from 'dotenv'
dotenv.config()
const app = express();



let transporter = nodemailer.createTransport({
  service: 'gmail',
  tls: {
    ciphers: "SSLv3"
  },
  auth: {
    user: process.env.ENV_MAIL,
    pass: process.env.ENV_PASS
  },
  tls: {rejectUnauthorized: false}
})


async function sendOrder(Lastname, Firstname, Tel, City, Postal, Order, rawPrice, Total) {
    let prePay = Math.round(Math.round(rawPrice) * 0.3 + 21)
  let info = await transporter.sendMail({
    from: `${process.env.FROM} <${process.env.ENV_MAIL}>`,
    to: process.env.ENV_PRO,
    subject: `Нове замовлення ${new Date().toLocaleString()}`,
    html: `
    <p>Ваше замовлення: </p>
    <p> ${Order} </p>
    <br>
    <p>П.І.Б: ${Lastname} ${Firstname} </p>
    <p>Номер телефону: +38${Tel} </p>
    <p>Місто доставки: ${City}  </p>
    <p>Відділення Нової Пошти: №${Postal} </p>
    <br>
    <p>Вартість замовлення: ${Total} </p>
    <br>
    <p>Передплата (~30%): ${prePay}₴ </p>
    <br>
    <p>Реквізити (монобанк): ${process.env.REQ} </p>
    <p>(${process.env.REQ_NAME}) </p>
     `
  })
  console.log('Sent successfully! Message id below...')
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
  let infoDB = getInfoFromDB(term)
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
  const {Price} = req.body
  const {Total} = req.body
  
 try {
   await sendOrder(Lastname, Firstname, Tel, City, Postal, order, Price, Total)
 } catch (error) {
  console.log(error)
 }
  res.render('checkout-success')
})

let port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`started on ${port}`)
});

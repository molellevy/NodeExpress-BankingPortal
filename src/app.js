const fs = require('fs')

const path = require('path')

const express = require('express')
const { __ } = require('ramda')

const app = express()

app.set('views', path.join(__dirname, '/views'));

app.set('view engine','ejs');

app.use('/', express.static(path.join(__dirname, 'public/')));
app.use(express.urlencoded({extended:tru}))

const accountData = fs.readFileSync('./src/json/accounts.json',{encoding:'UTF8'})

const accounts = JSON.parse(accountData)

const userData = fs.readFileSync('./src/json/users.json',{encoding:'utf8'})
const users = JSON.parse(userData)
app.get('/', (req, res) => {
    res.render('index',{title:'Account Summary',accounts:accounts});
})
app.get('/savings', (req,res)=>{
    res.render('account',{account: accounts.savings})
})

app.get('/checking', (req,res)=>{
    res.render('account',{account: accounts.checking})
})
app.get('/credit', (req,res)=>{
    res.render('account',{account: accounts.credit})
})
app.get('/profile', (req,res)=>{
    res.render('profile',{user: users[0]})
})

app.get('/transfer', (req, res) => {
    res.render('transfer');
})

app.post('/transfer', (req, res) => {
    const newBalance = ()=>{
        accounts[req.to].balance = parseInt( accounts[req.to].balance +  accounts[req.from])
        accounts[req.from].balance = parseInt( accounts[req.from].balance -  accounts[req.from])
        const accountsJSON = JSON.stringify(accounts)
        fs.copySync(path.resolve(__dirname, './src/json/accounts.json'), 'account_backup.json');
        fs.writeFileSync(path.resolve(__dirname, './src/json/accounts.json'),accountsJSON,{encoding:'utf8',flag:'w'})

    }
  res.render('transfer',{message: "Transfer Completed"});
})

app.listen(3000, () => {
    console.log('PS Project Running on port 3000!')
})
const Blockchain = require('./blockchain');
const Transaction = require('./transaction');
const express = require('express')

var app = express()

// Create new instance of Blockchain class
const savjeeCoin = new Blockchain();

// Gera pool de participantes
var fs = require("fs");
var path = require("path");
var absolutePath = path.resolve('keys.pem');
var keys = fs.readFileSync(absolutePath, "utf8");

// Uncomment this line if you want to test tampering with the chain
// savjeeCoin.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
console.log('Blockchain valid?', savjeeCoin.isChainValid() ? 'Yes' : 'No');

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// a = keys.split(',')
app.get('/api', (req, res) => {
  a=savjeeCoin.minePendingPool()
  // shuffleArray(a);
  res.send(a)
})

const bodyParser = require('body-parser');
app.use(bodyParser());

app.post('/api/pendingpool', (req, res) => {
  let body = req.body;
  if(!body.pk || body.pk.length<= 0 || !body.ms || body.ms.lenth <= 0)
    res.json('errou')
  let to = savjeeCoin.addPendingPoolPu(body)
  res.json(to)
});


app.listen(3000)

// adiciona uma nova publicKey ao pool
// as novas chaves serão adicionadas no inicio de um novo ciclo
addPendingPoolPu(body) {
  if (this.pendingPoolPu.filter(a => a.pk == body.pk).length > 0)
    return {
      "err": true,
      "msg": "publik key already added to pool"
    }
  this.pendingPoolPu.push({
    name: body.name,
    pk: body.pk
  })
  return {
    "err": false,
    "msg": "succes adding to pool"
  }
}

minePendingPool() {
  if ((this.currentPool.length + this.pendingPoolPu.length) < 3)
    return {
      "err": true,
      "msg": "o numero de participantes é menor que 3"
    }
  this.currentPool = this.currentPool.concat(this.pendingPoolPu.filter(item => {
    return this.currentPool.indexOf(item) < 0;
  }));
  this.pendingPoolPu = [];
  return {
    "err": false,
    "msg": "o numero de participantes é igual a "+this.currentPool.length
  }

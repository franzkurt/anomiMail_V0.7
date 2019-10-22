const Blockchain = require('./blockchain');
const express = require('express')

var app = express()
const bodyParser = require('body-parser');
app.use(bodyParser());

app.post('/api/pendingpool', (req, res) => {
  let body = req.body;
  if(!body.pk || body.pk.length<= 0 || !body.ms || body.ms.lenth <= 0)
    res.json('errou')
  let to = savjeeCoin.addPendingPoolPu(body)
  res.json(to)
});

app.get('/',(req,res)=>{
  res.send
})
app.listen(3000)

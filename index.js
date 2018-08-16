//libraries
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
//Loca Files
const BlockChain = require('./src/blockchain')
const miner = require('./src/api/miner')
const network = require('./src/api/network')
const transaction = require('./src/api/transaction')
const BlockLib = require('./src/block')
//Configs
const port = parseInt(process.env.PORT)
const address = process.env.ADDRESS || 'localhost'
const host = `http://${address}:${port}/`

//Blockchain
const PurseCoin = new BlockChain()
PurseCoin.chain.push(BlockLib.genesisBlock())
console.log(PurseCoin.chain)


const initServer = () => {
  
  const app = express()

  app.use(bodyParser.json())

  miner(app, axios, PurseCoin)
  network(app, axios, PurseCoin)
  transaction(app, axios, PurseCoin)
  
  app.listen(port, () => {
    console.log(`Listening to port ${host}`)
  })
}

if(typeof process.env.PORT === 'undefined') {
  console.log('Port must be set, e.g PORT=3000 node network.js')
  return
} else {
  initServer()
}
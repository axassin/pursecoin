//libraries
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
//Loca Files
const BlockChain = require('./src/blockchain')
const miner = require('./src/api/miner')
const network = require('./src/api/network')
const transaction = require('./src/api/transaction')
const block = require('./src/api/block')
const blockchain = require('./src/api/blockchain')
const wallet = require('./src/api/wallet')
const balance = require('./src/api/balance')
const cors = require('cors')
//Configs
const port = parseInt(process.env.PORT)
const address = process.env.ADDRESS || 'localhost'
const host = `http://${address}:${port}/`
const {
    genesisBlock
} = require('./src/Config')

//Blockchain
const PurseCoin = new BlockChain()
PurseCoin.chain.push(genesisBlock)

const initServer = () => {
  
  const app = express()

  app.use(bodyParser.json())
  app.use(cors())
  miner(app, axios, PurseCoin)
  network(app, axios, PurseCoin)
  transaction(app, axios, PurseCoin)
  block(app, axios, PurseCoin)
  blockchain(app, axios, PurseCoin)
  wallet(app, axios, PurseCoin)
  balance(app, axios, PurseCoin)

  app.listen(port, () => {
    console.log(`Listening to port ${host}`)
  })
  
}

if(typeof process.env.PORT === 'undefined') {
  console.log('Port must be set to')
  console.log('Linux: PORT=3000 ADDRESS=192.168.254.103 node index.js')
  console.log('Windows: set PORT=3000 && set ADDRESS=192.168.254.103 && node index.js')
  return
} else {
  initServer()
}
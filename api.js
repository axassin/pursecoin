const BlockChain = require('./blockchain')
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')

const port = parseInt(process.env.PORT)
const host = `http://localhost:${port}/`

const PurseCoin = new BlockChain()

PurseCoin.createNewTransaction("asdasd","wwewe","wewew")

server = axios.create({
  baseURL: host,
  responseType: 'json',
  headers: {
    Accept:'application/json',
    "Content-Type": 'application/json',
  }
})

const initServer = () => {
  
  let app = express()

  app.use(bodyParser.json())
  
  app.post('/transaction', (req, res) => {
    const {transaction} = req.body
    PurseCoin.addToPendingTransaction(transaction)
    console.log(PurseCoin.pendingTransactions)
    res.send({
      message: 'New Transaction added'
    })
  })

  app.post('/transaction/broadcast', (req, res) => {
    
    const {sender, recipient, value} = req.body
    const transaction = PurseCoin.createNewTransaction(sender,recipient, value)
    PurseCoin.addToPendingTransaction(transaction)
    console.log(PurseCoin.pendingTransactions)
    let broadcastTransactionPromise = []

    PurseCoin.nodes.map(node => {
      const url = `${node}/transaction`
      const promise = axios.post(url, {transaction})
      broadcastTransactionPromise.push(promise)
    })

    Promise.all(broadcastTransactionPromise).then(response => {
      res.send({
        message: 'Transaction has been broadcast'
      })
    }).catch(err => {
      res.status(400)
      res.send({
        error: "Fail to broadcast transaction"
      })
    })
  })

  app.post('/transaction/init', (req, res) => {
    const { pendingTransactions } = req.body
    PurseCoin.pendingTransactions = pendingTransactions
    console.log(PurseCoin.pendingTransactions)
    res.send({
      message: 'Transactions has been initialized'
    })
  })

  app.post('/network/brodcast', (req, res) => {

    const newNode = req.body.newNode

    if(PurseCoin.nodes.indexOf(newNode) < 0 ) {
      PurseCoin.nodes.push(newNode)
      console.log(PurseCoin.nodes)
      let nodePromises = []
      PurseCoin.nodes.map(node => {
       if(node !== newNode) {
        const url = `${node}/network/register`
        const data = {
          newNode
        }
        const nodeRequest =  axios.post(url, data)
        nodePromises.push(nodeRequest)
       }
      })
  
      Promise.all(nodePromises).then(response => {

        const url = `${newNode}/network/bulk`
        const nodes = [...PurseCoin.nodes, PurseCoin.currentNode]

        return axios.post(url, {nodes})

      }).then(response => {

        const url = `${newNode}/transaction/init`
        const pendingTransactions = PurseCoin.pendingTransactions

        return axios.post(url, {pendingTransactions})
        console.log('sucess bulking nodes')
      }).then(response => {
        console.log("Done brodcasting transactions to new node")
      }).catch(err => {
        console.log(err)
      })
  
      res.send({
        message: 'brodcast network'
      })

    } else {
      res.status(400)
      res.send({
        error: 'node already registered'
      })
    }
  })

  app.post('/network/register', (req, res) => {
    const {newNode} = req.body

    if(PurseCoin.nodes.indexOf(newNode) < 0 && newNode !== PurseCoin.currentNode) {
      PurseCoin.nodes.push(newNode)
      console.log(PurseCoin.nodes)
      res.send({
        message: newNode + ' is connected ' 
      })
    }
  })

  app.post('/network/bulk', (req, res) => {
    const nodes = req.body.nodes
    PurseCoin.nodes = [...PurseCoin.nodes, ...nodes].filter(node => node !== PurseCoin.currentNode)
    console.log(PurseCoin.nodes)
    res.send({
      message:  'Decentralized node'
    })
  })

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
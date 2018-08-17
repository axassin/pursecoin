
const uuid = require('uuid/v1')
const CryptoJS = require('crypto-js')

function Blockchain() {

  this.currentNode = `http://${process.env.ADDRESS || 'localhost'}:${parseInt(process.env.PORT)}`
  this.nodes = []
  this.pendingTransactions =  {}
  this.chain = []

}

Blockchain.prototype.createNewTransaction = function(sender, recipient, value) {

  const transaction = {
    sender, recipient, value, id: uuid()
  }

  return transaction
}

Blockchain.prototype.addToPendingTransaction = function(transaction) {

  this.pendingTransactions[transaction.id] = transaction

  return Object.keys(this.pendingTransactions).length
}

Blockchain.prototype.getLatestBlock = function() {

  return this.chain[this.chain.length - 1]
}

Blockchain.prototype.calculateHash = function(previousHash, timestamp, nonce) {

  return CryptoJS.SHA256(`${previousHash}|${timestamp}|${nonce}`).toString();
}

Blockchain.prototype.genesisBlock = function() {

  data = {
    "0":{
    recipient: 0,
    sender: 0,
    value: 0 
    }
  }

  return this.createNewBlock(0, "0","0",0, data, 0,0,3)
}

Blockchain.prototype.createNewBlock = function(index,
                                                 previousHash,
                                                 hash,
                                                 timestamp,
                                                 data,
                                                 nonce,
                                                 minerAddress,
                                                 difficulty = 3) {
  
  const block = {
    index, previousHash, hash, timestamp,data,nonce,
    minerAddress, difficulty
  }

  return block
}

Blockchain.prototype.mineBlock = function(minerAddress) {

  const { index, difficulty, hash } = this.getLatestBlock()
  const transactions = this.pendingTransactions
  let nextIndex = index + 1
  let nonce = 0
  let nextTimestamp = new Date().getTime() / 1000
  let nextHash = this.calculateHash(hash, nextTimestamp, nonce)
  const mining = new Promise((resolve, _reject) => {

    while(nextHash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      nonce++
      nextTimestamp = new Date().getTime() / 1000
      nextHash = this.calculateHash(hash, nextTimestamp, nonce)
      console.log({
        nonce
      })
    }
    const minedBlock = this.createNewBlock(nextIndex, 
                                            hash,
                                            nextHash,
                                            nextTimestamp,
                                            transactions,
                                            nonce,
                                            minerAddress,
                                            difficulty)

    resolve(minedBlock)
  })


  console.log("END OF MINING")
  return mining
}

Blockchain.prototype.bulkTransactions = function(pendingTransactions) {

  this.pendingTransactions = Object.assign(this.pendingTransactions, pendingTransactions)

  return this.pendingTransactions
}

Blockchain.prototype.bulkNodes = function(nodes) {

  this.nodes = [...this.nodes, ...nodes].filter(node => node !== this.currentNode)

  return this.nodes
}

Blockchain.prototype.registerBlock = function(block) {

  this.chain.push(block)
  return this.chain.length
}

Blockchain.prototype.removeTxsFromPendingTxs = function(txs) {

  let data = {}
  Object.keys(this.pendingTransactions).map(ptx => {
    if(!txs[ptx]) {
      data[ptx] = this.pendingTransactions[ptx]
    }
  })

  this.pendingTransactions = data

  return Object.keys(this.pendingTransactions).length
}

Blockchain.prototype.isValidBlock = function(minedBlock) {

    const lastBlock  = this.getLatestBlock()
    const validPrevHash = lastBlock.hash === minedBlock.previousHash
    const validIndex = lastBlock.index + 1 === minedBlock.index
    const validHash = this.calculateHash(lastBlock.hash, minedBlock.timestamp, minedBlock.nonce) === minedBlock.hash

    return validHash && validPrevHash && validIndex
}

module.exports = Blockchain
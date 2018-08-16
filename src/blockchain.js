
const uuid = require('uuid/v1')
const CryptoJS = require('crypto-js')

function Blockchain() {

  this.currentNode = `http://${process.env.ADDRESS || 'localhost'}:${parseInt(process.env.PORT)}`
  this.nodes = []
  this.pendingTransactions =  {}
  this.miningTransactions = []
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

  transactions = [{
    recipient: 0,
    sender: 0,
    value: 0 }]

  return this.createNewBlock(0, "0","0",0, transactions, 0,0,3)
}

Blockchain.prototype.createNewBlock = function(index, previousHash, hash, timestamp,transactions,nonce,minerAddress, difficulty = 3) {
  
  const block = {
    index, previousHash, hash, timestamp,transactions,nonce,minerAddress, difficulty
  }

  return block
}

Blockchain.prototype.mineBlock = function(transactions, minerAddress) {

  const { index, difficulty, hash } = this.getLatestBlock()
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
  console.log(this.chain)
  return this.chain.length
}

Blockchain.prototype.removeTxsFromPendingTxs = function(txs) {

  Object.keys(txs).map(tx => {
    if(this.pendingTransactions[tx] !== undefined) {
      delete this.pendingTransactions[tx]
    }
  })

  console.log("CURRENT PENDING TRANSACTIONS:")
  console.log(this.pendingTransactions)

  return Object.keys(this.pendingTransactions).length
}

module.exports = Blockchain
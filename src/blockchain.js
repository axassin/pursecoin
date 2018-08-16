
const uuid = require('uuid/v1')
const CryptoJS = require('crypto-js')

function Blockchain() {
  this.currentNode = `http://${process.env.ADDRESS || 'localhost'}:${parseInt(process.env.PORT)}`
  this.nodes = []
  this.pendingTransactions =  []
  this.chain = []
}

const Block = function() {
  this.nonce = nonce
  this.index = index
  this.previousHash = previousHash
  this.hash = hash
  this.timestamp = timestamp
  this.transactions = transactions
  this.minerAddress = minerAddress
  this.difficulty = difficulty
}

Blockchain.prototype.createNewTransaction = function(sender, recipient, value) {
  const transaction = {
    sender, recipient, value, transactionId: uuid()
  }
  return transaction
}

Blockchain.prototype.addToPendingTransaction = function(transaction) {
  this.pendingTransactions.push(transaction)

  return this.pendingTransactions.length
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

  return this.createNewBlock(0, "0","0",+new Date() / 1000, transactions, 0,0,4)
}

Blockchain.prototype.createNewBlock = function(index, previousHash, hash, timestamp,transactions,nonce,minerAddress, difficulty = 2) {
  const block = {
    index, previousHash, hash, timestamp,transactions,nonce,minerAddress, difficulty
  }

  return block
}

Blockchain.prototype.mineBlock = function(latestBlock,transactions, minerAddress) {
  const { index, difficulty, previousHash, hash } = latestBlock
  let nextIndex = index + 1
  let nonce = 0
  let nextTimestamp = new Date().getTime() / 1000
  let nextHash = this.calculateHash(previousHash, nextTimestamp, nonce)
  const mining = new Promise((resolve, _reject) => {
    while(nextHash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      nonce++
      nextTimestamp = new Date().getTime() / 1000
      nextHash = this.calculateHash(previousHash, nextTimestamp, nonce)
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


module.exports = Blockchain
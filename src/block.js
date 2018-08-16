
const CryptoJS = require('crypto-js')

const Block = function(index, previousHash, hash, timestamp,transactions,nonce, difficulty = 2) {
  this.nonce = nonce
  this.index = index;
  this.previousHash = previousHash
  this.hash = hash
  this.timestamp = timestamp;
  this.transactions = transactions;
  this.difficulty = difficulty
}

const calculateHash = (previousHash, timestamp, nonce) => {
  return CryptoJS.SHA256(`${previousHash}|${timestamp}|${nonce}`).toString();
};

const genesisBlock = () => {
  transactions = [
    {
      recipient: 0,
      sender: 0,
      value: 0
    }
  ]

  return new Block(0, "0","0",+new Date() / 1000, transactions, 0,0)
}

module.exports = {
  Block,
  calculateHash,
  genesisBlock
}
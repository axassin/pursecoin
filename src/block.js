
const CryptoJS = require('crypto-js')

const Block = function(index, previousHash, hash, timestamp,transactions,nonce,minerAddress, difficulty = 2) {
  this.nonce = nonce
  this.index = index
  this.previousHash = previousHash
  this.hash = hash
  this.timestamp = timestamp
  this.transactions = transactions
  this.minerAddress = minerAddress
  this.difficulty = difficulty
}

const calculateHash = (previousHash, timestamp, nonce) => {
  return CryptoJS.SHA256(`${previousHash}|${timestamp}|${nonce}`).toString();
};

const mineBlock = (latestBlock,transactions, minerAddress) => {

  const { index, difficulty, previousHash } = latestBlock
  let nextIndex = index + 1
  let nonce = 0
  let nextTimestamp = new Date().getTime() / 1000
  let nextHash = calculateHash(previousHash, nextTimestamp, nonce)
  const mining = new Promise((resolve, _reject) => {
    while(nextHash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      nonce++
      nextTimestamp = new Date().getTime() / 1000
      nextHash = calculateHash(previousHash, nextTimestamp, nonce)
      console.log({
        nonce
      })
    }
    const minedBlock = new Block(nextIndex, 
                                  previousHash,
                                  nextHash,
                                  nextTimestamp,
                                  transactions,
                                  nonce,
                                  minerAddress,
                                  difficulty)

    resolve(minedBlock)
  })



  return mining
 console.log("END OF MINING")
}

const genesisBlock = () => {
  transactions = [{
                recipient: 0,
                sender: 0,
                value: 0 }]

  return new Block(0, "0","0",+new Date() / 1000, transactions, 0,0,4)
}


module.exports = {
  Block,
  calculateHash,
  genesisBlock,
  mineBlock
}
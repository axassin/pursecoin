
const axios = require('axios')

const miner = {}

miner.mineBlock = function(minerAddress) {

    const { index, difficulty, hash } = this.getLatestBlock()

    // console.log()
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
  
    // return mining
}

miner.start = function(config) {
    const {url, minerAddress} = config
    this.nodeUrl = url
    this.minerAddress = minerAddress
    
    this.mineBlock()
    // mineBlock(minerAddress)
    // mineBlock(minerAddress).then(data => {
    //     console.log
    // })
}

module.exports = miner



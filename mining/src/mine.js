
const axios = require('axios')
const CryptoUtils = require('../../blockchain/src/util/crypto')
const miner = {}

miner.mineBlock = async function() {

    // const { index, difficulty, hash } = this.getLatestBlock()

    let block = await axios.get(this.mineBlockUrl)
        .then(response => response.data).catch(err => err.data)

    block.difficulty = 1
    block.nonce = 0
    block.dateCreated = new Date().toISOString()
    block.blockHash = this.getBlockHash(block.blockDataHash, block.dateCreated , block.nonce)

    while(block.blockHash.substring(0, block.difficulty) !== Array(block.difficulty + 1).join('0')) {
        block.nonce++
        block.dateCreated = new Date().toISOString()
        block.blockHash = this.getBlockHash(block.blockDataHash, block.dateCreated , block.nonce)
        
        console.log({
          nonce: block.nonce,
          blockHash: block.blockHash
        })
    }

    axios.post(this.submitBlockURL, block)
        .then(response => console.log(response.data))
        .catch(error => console.log(error.data))


    // const transactions = this.pendingTransactions
    // let nextIndex = index + 1
    // let nonce = 0
    // let nextTimestamp = new Date().getTime() / 1000
    // let nextHash = this.calculateHash(hash, nextTimestamp, nonce)
    // const mining = new Promise((resolve, _reject) => {
  
    //   while(nextHash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    //     nonce++
    //     nextTimestamp = new Date().getTime() / 1000
    //     nextHash = this.calculateHash(hash, nextTimestamp, nonce)
    //     console.log({
    //       nonce
    //     })
    //   }
    //   const minedBlock = this.createNewBlock(nextIndex, 
    //                                           hash,
    //                                           nextHash,
    //                                           nextTimestamp,
    //                                           transactions,
    //                                           nonce,
    //                                           minerAddress,
    //                                           difficulty)
  
    //   resolve(minedBlock)
    // })
  
    // return mining
}

miner.start = function(config) {
    const {url, minerAddress} = config
    this.minerAddress = minerAddress
    this.mineBlockUrl = `${url}/mine-block/address/${minerAddress}`
    this.submitBlockURL = `${url}/mine-block/submit`

    this.mineBlock()
    // mineBlock(minerAddress)
    // mineBlock(minerAddress).then(data => {
    //     console.log
    // })
}

miner.getBlockHash = function(blockDataHash, dateCreated, nonce) {
    const blockData = `${blockDataHash}|${dateCreated}|${nonce}` 
    return CryptoUtils.sha256(blockData)
}

module.exports = miner



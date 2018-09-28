
const axios = require('axios')
const CryptoUtils = require('../../blockchain/src/util/crypto')
const miner = {}

miner.mineBlock = async function() {

    // const { index, difficulty, hash } = this.getLatestBlock()
    while(true) {

   
        let block = await axios.get(this.mineBlockUrl)
            .then(response => response.data).catch(err => err.data)
        console.log(block)
        block.difficulty = 1 // for easy test
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
    }
}

miner.start = function(config) {
    const {url, minerAddress} = config
    this.minerAddress = minerAddress
    this.mineBlockUrl = `${url}/mine-block/address/${minerAddress}`
    this.submitBlockURL = `${url}/mine-block/submit`

    this.mineBlock()
}

miner.getBlockHash = function(blockDataHash, dateCreated, nonce) {
    const blockData = `${blockDataHash}|${dateCreated}|${nonce}` 
    return CryptoUtils.sha256(blockData)
}

module.exports = miner



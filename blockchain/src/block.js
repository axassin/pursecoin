
const CryptoUtils = require('./util/crypto')

class Block {
    constructor(index, transactions, difficulty, prevBlockHash,
                minedBy, blockDataHash, nonce, dateCreated, blockHash) {
        
        this.index = index
        this.transactions = transactions
        this.difficulty = difficulty
        this.prevBlockHash = prevBlockHash
        this.minedBy = minedBy
        this.blockDataHash = blockDataHash
        this.nonce = nonce
        this.dateCreated = dateCreated
        this.blockHash = blockHash
    }
}

Block.prototype.calculateBlockDataHash = function() {
    const blockData = {
        index: this.index,
        transactions: this.transactions,
        difficulty: this.difficulty,
        prevBlockhash: this.prevBlockHash,
        minedBy: this.minedBy
    }

    const blockDataJSON = JSON.stringify(blockData)

    this.blockDataHash = CryptoUtils.sha256(blockDataJSON)
}

Block.prototype.calculateBlockHash = function() {
    const blockData = `${this.blockDataHash}|${this.dateCreated}|${this.nonce}` 
    this.blockHash = CryptoUtils.sha256(blockData)
}


module.exports = Block
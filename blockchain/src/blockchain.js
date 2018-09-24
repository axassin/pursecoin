
const uuid = require('uuid/v1')
const CryptoJS = require('crypto-js')
const Transaction = require('./transaction')
const Block = require('./block')
const argNode = `http://${process.env.ADDRESS || 'localhost'}:${parseInt(process.env.PORT)}`
const Config = require('./Config')

function Blockchain(currentNode = argNode, nodes = [], pendingTransactions = {}, chain = []) {

  this.currentNode = currentNode
  this.nodes = nodes
  this.pendingTransactions =  pendingTransactions
  this.chain = chain
}

Blockchain.prototype.createNewTransaction = function(txnData) {

    const txn = new Transaction(
        txnData.from,
        txnData.to,
        txnData.value,
        txnData.fee,
        txnData.dateCreated,
        txnData.data,
        txnData.senderPubKey,
        txnData.senderSignature
    )

    if(this.getTxnByDataHash(txn.transactionDataHash)) {
        return {
            error: `Duplicate Transactions: ${txn.transactionDataHash}`
        }
    }

    if( !txn.isValidSignature ){
        return {
            error: `Invalid Signature: ${txn.senderSignature}`
        }
    }

    if(this.getAccountBalance(txn.from) < txn.fee + txn.value) {
        return {
            error: `Insufficient Balance from address: ${txn.from}`
        }
    }

    this.addToPendingTransaction(txn)

    return txn
}

Blockchain.prototype.getConfirmedTransactions = function() {
    let transactions = {}

    this.chain.map(block => {
        transactions = {...transactions, ...block.transactions}
    })

    return transactions
}

Blockchain.prototype.calculateConfirmedBalance = function() {
    const transactions  = this.getConfirmedTransactions()
    const balances = {}

    Object.keys(transactions).map(tnx => {
        const txn = transactions[tnx]
        balances[txn.from] = balances[txn.from] || 0
        balances[txn.to] = balances[tnx.to] || 0
        balances[txn.from] -= txn.fee
        if(txn.transferSuccessful) {
            balances[txn.from] -= txn.value
            balances[txn.to] += txn.value
        }
    })

    return balances
}

Blockchain.prototype.getAllTransactions = function() {
    return {...this.getConfirmedTransactions(), ...this.pendingTransactions}
}

Blockchain.prototype.getTxnByDataHash = function(transHash) {
    return this.getAllTransactions()[transHash]
}

Blockchain.prototype.addToPendingTransaction = function(transaction) {

  this.pendingTransactions[transaction.transactionDataHash] = transaction

  return Object.keys(this.pendingTransactions).length
}

Blockchain.prototype.getLatestBlock = function() {

  return this.chain[this.chain.length - 1]
}

Blockchain.prototype.getTxnHistory = function(address) {
    const transactions = this.getAllTransactions()
    const transactionByAddress = {}
    
    return Object.keys(transactions).filter(tnx => {
        return transactions[tnx].to === address || transactions[tnx].from
    }).map(tnx => transactions[tnx])
}

Blockchain.prototype.getAccountBalance = function(address) {
    const transactions = this.getAllTransactions()

    const balance = {
        pendingBalance : 0,
        safeBalance: 0,
        confirmedBalance: 0
    }
    Object.keys(transactions).map(tnx => {
        tnx = transactions[tnx]

        let confirmTnxCount = 0

        if(tnx.from === address) {
            if(confirmTnxCount === 0 && tnx.transferSuccessful) {
                balance.pendingBalance -= tnx.value
            }
            if(confirmTnxCount > 0) {
                balance.confirmedBalance -= fee
                if(tnx.transferSuccessful) {
                    balance.confirmedBalance -= value
                }
            }
            if(confirmTnxCount >= Config.safeConfirmCount) {
                balance.safeBalance -= tnx.fee

                if(tnx.transferSuccessful) {
                    balance.safeBalance -= tnx.value
                }
            }
        } else if(tnx.to === address) {
            if(confirmTnxCount === 0 && tnx.transferSuccessful) {
                balance.pendingBalance += tnx.value
            } else if(confirmTnxCount > 0 && tnx.transferSuccessful) {
                balance.confirmedBalance += tnx.value
            } else if(confirmTnxCount >= Config.safeConfirmCount && tnx.transferSuccessful) {
                balance.safeBalance += tnx.value
            }

        }
    })

    return balance
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

  return this.createNewBlock(0, "0","0",0, data, 0,0,4)
}

Blockchain.prototype.createNewBlock = function(index,
                                                transactions,
                                                difficulty,
                                                previousBlockHash,
                                                minedBy, 
                                                blockDataHash,
                                                nonce,
                                                dateCreated,
                                                blockHash) {
  
//   const block = {
//     index, previousBlockHash, blockDataHash, timestamp,data,nonce,
//     minerAddress, difficulty
//   }

//   return block
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

Blockchain.prototype.removePendingTxn = function(tnx) {

  let data = {}
  Object.keys(this.pendingTransactions).map(ptx => {
    if(!tnx[ptx]) {
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

Blockchain.prototype.isValidChain = function(chain) {
  for (let i = 1; i < chain.length; i++) {
    let currentBlock = chain[i]
    let prevBlock = chain[i - 1]
    const prevHash = currentBlock.previousHash === prevBlock.hash
    if(!prevHash) {
      return false
    }
  }

  return true
}

Blockchain.prototype.concensus = function(promiseBlockchains) {
  let maxChainLength = this.chain.length
  let newChain = null
  let newPendingTransactions = null
  promiseBlockchains.map(response => {  
    const bc = response.data.blockchain
    bcChainLength = bc.chain.length
    if(bcChainLength > maxChainLength) {
      newChain = bc.chain
      newPendingTransactions = bc.pendingTransactions
      maxChainLength = bcChainLength
    }
  })
  if(newChain && newPendingTransactions && this.isValidChain(newChain)) {
    this.chain = newChain
    this.pendingTransactions = newPendingTransactions
  }
}

module.exports = Blockchain

const CryptoJS = require('crypto-js')
const Transaction = require('./transaction')
const Block = require('./block')
const argNode = `http://${process.env.ADDRESS || 'localhost'}:${parseInt(process.env.PORT)}`
const Config = require('./Config')
const Util = require('../src/util/blockchain')

function Blockchain(currentNode = argNode, nodes = [], pendingTransactions = {}, chain = []) {
  this.currentNode = currentNode
  this.nodes = nodes
  this.pendingTransactions =  pendingTransactions
  this.chain = chain
  this.miningBlock = {}
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

    if( !txn.isValidSignature()){
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

Blockchain.prototype.getConfirmedBalances = function() {
    const transactions  = this.getConfirmedTransactions()
    const balances = {}

    Object.keys(transactions).map(txn => {
        txn = transactions[txn]
        balances[txn.from] = balances[txn.from] || 0
        balances[txn.to] = balances[txn.to] || 0
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

Blockchain.prototype.getNextBlockCandidate = function(minerAddress, difficulty = 4) {

    const nextBlockIndex = this.chain.length
    let transactions = this.pendingTransactions

    const coinbaseTxn = Config.rewardTransaction(nextBlockIndex, minerAddress)
    const balances = this.getConfirmedBalances()

    Object.keys(transactions).map(txn => {
        txn = transactions[txn]
        balances[txn.from] = balances[txn.from] || 0
        balances[txn.to] = balances[txn.to] || 0
        if(balances[txn.from] >= txn.fee) {
            coinbaseTxn.minedInBlockIndex = nextBlockIndex
            txn.minedInBlockIndex = nextBlockIndex

             balances[txn.from] -= txn.fee
             coinbaseTxn.value += txn.fee

             if(balances[txn.from] >= txn.value) {
                 balances[txn.from] -= txn.value
                 balances[txn.to] += txn.value
                 txn.transferSuccessful = true
             } else {
                 txn.transferSuccessful = false
             }
        } else {
            this.removeFromPendingTxn([txn])
            Util.removeObject(txn, transactions)
        }
    })

    coinbaseTxn.calculateDataHash()

    transactions[coinbaseTxn.transactionDataHash] = coinbaseTxn

    const latestBlock = this.getLatestBlock()
    const nextBlock = new Block(
        nextBlockIndex,
        transactions,
        difficulty,
        latestBlock.blockDataHash,
        minerAddress
    )


    this.miningBlock[nextBlock.blockDataHash] = nextBlock

    return nextBlock
}

Blockchain.prototype.bulkTransactions = function(pendingTransactions) {

  this.pendingTransactions = Object.assign(this.pendingTransactions, pendingTransactions)

  return this.pendingTransactions
}

Blockchain.prototype.bulkNodes = function(nodes) {

  this.nodes = [...this.nodes, ...nodes].filter(node => node !== this.currentNode)

  return this.nodes
}

Blockchain.prototype.verifyMinedBlock = function(minedBlock) {

    let block = this.miningBlock[minedBlock.blockDataHash]
    const {
        dateCreated,
        nonce,
        blockHash
    } = minedBlock
    if(!block) {
        return {
            error: 'Block already mined'
        }
    }

    block.dateCreated = dateCreated
    block.nonce = nonce,
    block.calculateBlockHash()
    if(block.blockHash !== blockHash) {
        return {
            error: 'Invalid blockhash'
        }
    }

    return this.registerBlock(block)
}

Blockchain.prototype.registerBlock = function(block) {
  
    const isValidBlock = this.isValidBlock(block)

    if(!isValidBlock[0]) {
        return {
          error: 'Block is already mined'
        }
    }

    if(!isValidBlock[1]) {
        return {
            error: 'Incorrect previous block hash'
        }
    }

    this.chain.push(block)

    this.miningBlock = {}

    this.removeFromPendingTxn(Object.keys(block.transactions))

    return block
}

Blockchain.prototype.removeFromPendingTxn = function(txn) {

  const transactions = this.pendingTransactions
  let data = {}
  
  txn.map(removeTxn => {
    Object.keys(transactions).map(ptx => {
        if(!transactions[removeTxn]) {
          data[ptx] = transactions[ptx]
        }
      })
  })

  this.pendingTransactions = data

  return Object.keys(this.pendingTransactions).length
}

Blockchain.prototype.isValidBlock = function(minedBlock) {

    const lastBlock  = this.getLatestBlock()
    const validPrevHash = lastBlock.blockDataHash === minedBlock.prevBlockHash
    const validIndex = lastBlock.index + 1 === minedBlock.index
    // const validHash = this.calculateHash(lastBlock.hash, minedBlock.timestamp, minedBlock.nonce) === minedBlock.hash
    return [validIndex, validPrevHash]
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
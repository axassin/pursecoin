
const uuid = require('uuid/v1')


function Blockchain() {
  this.currentNode = `http://localhost:${parseInt(process.env.PORT)}`
  this.nodes = []
  this.pendingTransactions =  []
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

module.exports = Blockchain
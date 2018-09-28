const CryptoUtils = require('./util/crypto')



function Transaction(from, to, value, fee, dateCreated, data, senderPubKey, senderSignature, minedInBlockIndex, transferSuccessful) {
    this.from = from
    this.to = to
    this.value = value
    this.fee = fee
    this.dateCreated = dateCreated
    this.data = data
    this.senderPubKey = senderPubKey
    this.senderSignature = senderSignature
    this.minedInBlockIndex = minedInBlockIndex
    this.transferSuccessful = transferSuccessful

    this.calculateDataHash()
    
}

Transaction.prototype.calculateDataHash = function() {
    const transaction = {
        from: this.from,
        to: this.to,
        value: this.value,
        fee: this.fee,
        dateCreated: this.dateCreated,
        data: this.data,
        senderPubKey: this.senderPubKey
    }

    let transactionJSON = JSON.stringify(transaction)
    
    this.transactionDataHash = CryptoUtils.sha256(transactionJSON)
}

Transaction.prototype.sign = function(privateKey) {
    this.senderSignature = CryptoUtils.signData(this.transactionDataHash, privateKey)
}

Transaction.prototype.isValidSignature = function() {
    return CryptoUtils.verifySignature(this.transactionDataHash, this.senderPubKey, this.senderSignature)
}

module.exports = Transaction
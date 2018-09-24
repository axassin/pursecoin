const Transaction = require('../transaction')

const BlockChain = require('../blockchain')
const PurseCoin = new BlockChain

let tran = new Transaction(
    "aa5d9d47474b26927827c88a162b2e150349e10f", // fromAddress
    "3d5c0bfbbb3dd69e7f04d80e6f206f0b54b7eb88", // toAddress
    50000,                                      // transactionValue
    20,                                         // fee
    "2018-03-01T20:11:58.441Z",                 // dateCreated,
    100,                                        // data
    "f73df83ca0f807528a83bfacf2a935f8c7a37a5b5ce06e393707b798804c71b01",    // senderPubKey
);

// PurseCoin.addToPendingTransaction(tran)
// console.log(PurseCoin.pendingTransactions)
console.log(PurseCoin.getTxnByDataHash(tran.transactionDataHash))
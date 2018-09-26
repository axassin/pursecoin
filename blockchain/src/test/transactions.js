const Transaction = require('../transaction')

const BlockChain = require('../blockchain')
const PurseCoin = new BlockChain

// let tran = new Transaction(
//     "aa5d9d47474b26927827c88a162b2e150349e10f", // fromAddress
//     "3d5c0bfbbb3dd69e7f04d80e6f206f0b54b7eb88", // toAddress
//     50000,                                      // transactionValue
//     20,                                         // fee
//     "2018-03-01T20:11:58.441Z",                 // dateCreated,
//     100,                                        // data
//     "f73df83ca0f807528a83bfacf2a935f8c7a37a5b5ce06e393707b798804c71b01",    // senderPubKey
// );

// // PurseCoin.addToPendingTransaction(tran)
// // console.log(PurseCoin.pendingTransactions)
// tran.value += 2
// tran.calculateDataHash()
// console.log(tran)

// const postmanTxn = new Transaction(
//     "8c6cd5882bfaa67749a2403c435e3998d0403757",
//     "0000000000000000000000000000000000000000",
//     30000,
//     100,
//     "2018-09-25T16:12:58.599Z",
//     "this is jio",
//     "284e70bbaa5aeae5fe178c0d98e9699156be0ad80bea4205dea736693872a0c1"
// )
// postmanTxn.sign("ee4dea2d90616a95439249ff9b0c7c71fba8a71a0bd5e3532595a8ab900380b0")
const postmanTxn = new Transaction(
    "c3293572dbe6ebc60de4a20ed0e21446cae66b17",
    "0000000000000000000000000000000000000000",
    30000,
    100,
    "2018-09-25T16:12:58.599Z",
    "this is jioasd",
    "c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba1"
)
postmanTxn.sign("7e4670ae70c98d24f3662c172dc510a085578b9ccc717e6c2f4e547edd960a34")
console.log(postmanTxn.isValidSignature())
console.log(postmanTxn)
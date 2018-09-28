
const Transaction = require('./transaction')
const Block = require('./block')

const faucetPrivateKey = '7e4670ae70c98d24f3662c172dc510a085578b9ccc717e6c2f4e547edd960a34'
const faucetPublicKey = 'c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba1'
const faucetAddress = 'c3293572dbe6ebc60de4a20ed0e21446cae66b17'
const nullAddress = '0000000000000000000000000000000000000000'
const nullPublicKey = '0000000000000000000000000000000000000000000000000000000000000000'
const nullSignature = [
    '000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000'
]
const genesisDate = "2018-01-01T00:00:00.000Z";
const blockReward = 3000000

const genesisTransaction = new Transaction(
    nullAddress,    //fom
    faucetAddress,  //to
    1000000000000000,   //value
    0,  //fee
    genesisDate,    //dateCreated
    "genesis transactions", //data
    nullPublicKey,  //senrderPubKey
    nullSignature,  //senderSignature
    0,  //index
    true    //transferSuccessful
)

const genesisBlock = new Block(
    0,  //index
    [genesisTransaction], //transactions
    0,  //difficulty
    undefined,  //prevBlockHash
    nullAddress,  //miner address
    undefined,  //blockDataHash
    0,  //nonce
    genesisDate,    //dateCreated
    undefined //blockHash
)

const rewardTransaction = (index, minerAddress) => (
    new Transaction(
        nullAddress,    //from
        minerAddress,   //to
        blockReward,    //value
        0,  //fee
        new Date().toISOString(), //dateCreated
        'coinbase tx', //data
        nullPublicKey,  //publicKey
        nullSignature,  //signature
        index,  //index
        true    //transferSuccessful
    )
)

module.exports = {
    faucetPrivateKey,
    faucetPublicKey,
    faucetAddress,
    nullAddress,
    nullPublicKey,
    nullSignature,
    genesisDate,
    genesisTransaction,
    genesisBlock,
    safeConfirmCount: 3,
    maxTransactionFee: 10000000,
    blockReward,
    maxTxnValue:1000000000000000,
    rewardTransaction
}

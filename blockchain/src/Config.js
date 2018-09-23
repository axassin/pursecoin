
const Transaction = require('../transaction')
const Block = require('../block')

const faucetPrivateKey = 'ee4dea2d90616a95439249ff9b0c7c71fba8a71a0bd5e3532595a8ab900380b0'
const faucetPublicKey = '284e70bbaa5aeae5fe178c0d98e9699156be0ad80bea4205dea736693872a0c1'
const faucetAddress = '8c6cd5882bfaa67749a2403c435e3998d0403757'

const nullAddress = '0000000000000000000000000000000000000000'
const nullPublicKey = '0000000000000000000000000000000000000000000000000000000000000000'
const nullSignature = [
    '000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000'
]

const genesisDate = "2018-01-01T00:00:00.000Z";

const genesisTransaction = new Transaction(
    nullAddress,
    faucetAddress,
    1000000000000,
    0,
    genesisDate,
    "genesis transactions",
    nullPublicKey,
    undefined,
    nullSignature,
    0,
    true
)

const genesisBlock = new Block(
    0,
    [genesisTransaction],
    0,
    undefined,
    nullAddress,
    undefined,
    0,
    genesisDate,
    undefined
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
    safeConfirmCount: 3
}

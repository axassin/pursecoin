
const axios = require('axios')
const CryptoJS = require('crypto-js')

server = axios.create({
  baseURL: 'https://stormy-everglades-34766.herokuapp.com/',
  responseType: 'json',
  headers: {
    Accept:'application/json',
    "Content-Type": 'application/json',
  }
})

const address = 'pursecoin'

const calculateHash = (index, previousHash, timestamp, data, nonce) => {
  return CryptoJS.SHA256(index + previousHash + timestamp + data + nonce).toString();
};

const mineBlock = () => {
  server.get(`/mining/get-mining-job/${address}`).then(response => {
    let transactions = response.data
    let { index, difficulty, blockDataHash } = transactions
    index += 1
    // difficulty = 5
    let nonce = 0
    let nextTimestamp = new Date().getTime() / 1000
    let nextHash = calculateHash(index, blockDataHash, nextTimestamp, transactions, nonce)
    
    while(nextHash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      nonce++
      nextTimestamp = new Date().getTime() / 1000
      nextHash = calculateHash(index, blockDataHash, nextTimestamp, transactions, nonce)
      console.log({
        nonce,
        nextHash
      })
    }

    minedBlock = {
      nonce,
      nextTimestamp,
      blockDataHash,
      nextHash
    }

    server.post('/mining/submit-mined-block', minedBlock).then(respose => {
      console.log(respose.data)

    }).catch(err => {
      console.log(err)
    })

   console.log("Stopped")
  })
}

mineBlock()

// { 
//   index: 7,
//   transactionsIncluded: 1,
//   difficulty: 5,
//   expectedReward: 5000000,
//   rewardAddress: 'pursecoin',
//   blockDataHash: '9a04bd7f748b6ea5282039d2b3ba245e5e9acd5d4b19b597096e5929f20b3e2a' 
// }


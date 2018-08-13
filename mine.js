
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
  return CryptoJS.SHA256(`${previousHash}|${timestamp}|${nonce}`).toString();
};

const mineBlock = () => {
  server.get(`/mining/get-mining-job/${address}`).then(response => {
    let transactions = response.data
    let { index, difficulty, blockDataHash } = transactions
    let nextIndex = index + 1
    let nonce = 0
    let nextTimestamp = new Date()
    let nextHash = calculateHash(nextIndex, blockDataHash, nextTimestamp, transactions, nonce)

    while(nextHash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      nonce++
      nextTimestamp = new Date()
      nextHash = calculateHash(nextIndex, blockDataHash, nextTimestamp, transactions, nonce)
      console.log({
        nonce,
        nextHash,
        nextTimestamp
      })
    }


    minedBlock = {
      nonce,
      dateCreated: nextTimestamp,
      blockDataHash,
      blockHash:nextHash
    }

    server.post('/mining/submit-mined-block', minedBlock).then(respose => {
      console.log(respose.data)
      mineBlock()
    }).catch(err => {
      console.log(err)
      mineBlock()
    })

   console.log("Stopped")
  })
}

mineBlock()



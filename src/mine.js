
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

const address = 'b3d72ad831b3e9cdbdaeda5ff4ae8e9cf182e548'.toLowerCase()

const calculateHash = (previousHash, timestamp, nonce) => {
  return CryptoJS.SHA256(`${previousHash}|${timestamp}|${nonce}`).toString();
};

const mineBlock = () => {
  server.get(`/mining/get-mining-job/${address}`).then(response => {
    let transactions = response.data
    let { index, difficulty, blockDataHash } = transactions
    let nextIndex = index + 1
    let nonce = 0
    let nextTimestamp = new Date().getTime() / 1000
    let nextHash = calculateHash(blockDataHash, nextTimestamp, nonce)

    while(nextHash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      nonce++
      nextTimestamp = new Date().getTime() / 1000
      nextHash = calculateHash(blockDataHash, nextTimestamp, nonce)
      console.log({
        nonce
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
      // mineBlock()
    }).catch(err => {
      console.log(err)
      // mineBlock()
    })

   console.log("Stopped")
  })
}

mineBlock()



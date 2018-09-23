
  const Blockchain = require('../blockchain')
  const axios = require('axios')
  const minerAddress = '123123123'
 
  function mine() {
    axios.get('http://localhost:3000/blockchain').then(response => {
      const {currentNode, nodes, pendingTransactions, chain} = response.data.blockchain
      PurseCoin = new Blockchain(currentNode, nodes, pendingTransactions, chain)
      const { index, difficulty, hash } = PurseCoin.getLatestBlock()
      difficulty = 2
      const transactions = PurseCoin.pendingTransactions
      let nextIndex = index + 1
      let nonce = 0
      let nextTimestamp = new Date().getTime() / 1000
      let nextHash = PurseCoin.calculateHash(hash, nextTimestamp, nonce)
    
        while(nextHash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
          nonce++
          nextTimestamp = new Date().getTime() / 1000
          nextHash = PurseCoin.calculateHash(hash, nextTimestamp, nonce)
        }
        const minedBlock = PurseCoin.createNewBlock(nextIndex, 
                                                hash,
                                                nextHash,
                                                nextTimestamp,
                                                transactions,
                                                nonce,
                                                minerAddress,
                                                difficulty)
       return "Hi"
    }).catch(err => {
      return "error"
    })
  }


  console.log(mine())
  
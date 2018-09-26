
const miner = function(app, axios, PurseCoin) {

  app.post(`/mining/mine` , (req, res) => {
     const {address} = req.body
     const mineBlock = PurseCoin.mineBlock(address)

     mineBlock.then(minedBlock => {
        if(PurseCoin.isValidBlock(minedBlock)) {
          PurseCoin.registerBlock(minedBlock)
          PurseCoin.removeTxsFromPendingTxs(minedBlock.data)
          const submitMinedBlockPromise = []

          PurseCoin.nodes.map(node => {
            if(node !== PurseCoin.currentNode) {
              submitMinedBlockPromise.push(axios.post(`${node}/block/broadcast`, {minedBlock}))
            }
          })
          Promise.all(submitMinedBlockPromise).then(response => {
            res.send({
              message: "Broadcast mined block"
            })
           })
        } else {
          res.send({
            error: "Block is already mined"
          })
        }
     }).catch(err => {
       console.log("MINING ERROR")
       console.log(err)
     })
     
  })

    app.post('/minded-block/broadcast', (req, res) => {
        const {minedBlock} = req.body

        let response = {
            message: "Block Added"
        }
        
        if(PurseCoin.isValidBlock(minedBlock)) {
            PurseCoin.registerBlock(minedBlock)
            PurseCoin.removeTxsFromPendingTxs(minedBlock.data)
            res.send(response)
        } else {
            console.log("INVALID BLOCK")
        }

        response = {
            error: "Invalid Block or Already mined"
        }
        
        res.send(response)
    })

    app.get('/mine-block/:address', (req, res) => {
        const address = req.params.address
        const {index,
                transactions,
                difficulty,
                blockDataHash} = PurseCoin.getNextBlockCandidate(address)

        const coinbaseTxn = transactions[Object.keys(transactions)[0]]

        res.send({
            index,
            numberOfTransactions: transactions.length,
            difficulty,
            expectedReward: coinbaseTxn.value,
            rewardAddress: coinbaseTxn.to,
            blockDataHash
        })

    })
}

module.exports = miner
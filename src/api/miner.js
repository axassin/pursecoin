
const miner = function(app, axios, PurseCoin) {

  app.post(`/mining/mine` , (req, res) => {
     const {address} = req.body
     const latestBlock = PurseCoin.getLatestBlock()
     const trannsactions = PurseCoin.pendingTransactions
     const mineBlock = PurseCoin.mineBlock(latestBlock, trannsactions, address)

     mineBlock.then(minedBlock => {
       PurseCoin.chain.push(minedBlock)
       const submitMinedBlockPromise = []

        PurseCoin.nodes.map(node => {
          if(node !== PurseCoin.currentNode) {
            submitMinedBlockPromise.push(axios.post(`${node}/mining/broadcast-mined-block`, {minedBlock}))
          }
        })
       
       Promise.all(submitMinedBlockPromise).then(response => {
        res.send({
          message: "Submit block to nodes"
        })
       })

     }).catch(err => {
       console.log("MINING ERROR")
       console.log(err)
     })
     
  })

  app.post('/mining/broadcast-mined-block', (req, res) => {
    const {minedBlock} = req.body
    PurseCoin.chain.push(minedBlock)

    console.log(PurseCoin.chain)
    res.send({
      message: "Added block"
    })

  })

}

module.exports = miner
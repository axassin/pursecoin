
const miner = function(app, axios, PurseCoin) {

  app.post(`/mining/mine` , (req, res) => {
     const {address} = req.body
     const transactions = PurseCoin.pendingTransactions
     const mineBlock = PurseCoin.mineBlock(transactions, address)

     mineBlock.then(minedBlock => {
       PurseCoin.registerBlock(minedBlock)
       const submitMinedBlockPromise = []

        PurseCoin.nodes.map(node => {
          if(node !== PurseCoin.currentNode) {
            submitMinedBlockPromise.push(axios.post(`${node}/block/broadcast`, {minedBlock}))
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
}

module.exports = miner

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
}

module.exports = miner
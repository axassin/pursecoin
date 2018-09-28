const blockchain = function(app, axios, PurseCoin) {
  app.get('/blockchain', (_req, res) => {
    res.send({
      blockchain: PurseCoin
    })
  })

  app.get('/blockchain/concensus', (_req, res) => {
    let blockchainsReponse = []

    if(PurseCoin.nodes.length > 0) {
      PurseCoin.nodes.map(node => {
        const url = `${node}/blockchain`
        blockchainsReponse.push(axios.get(url))
      })
      Promise.all(blockchainsReponse).then(response => {
        // console.log(response[0].data.blockchain)
        PurseCoin.concensus(response)
        res.send({
          message: "Concensus success"
        })
      })
    } else {
      res.send({
        error: "No connected nodes"
      })
    }
  })
}

module.exports = blockchain
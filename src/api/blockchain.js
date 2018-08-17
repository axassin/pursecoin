const blockchain = function(app, axios, PurseCoin) {
  app.get('/blockchain', (_req, res) => {
    res.send({
      blockchain: PurseCoin
    })
  })
}

module.exports = blockchain
const transaction = function(app, axios, PurseCoin) {

  app.post('/transaction', (req, res) => {
    const {transaction} = req.body
    PurseCoin.addToPendingTransaction(transaction)
    res.send({
      message: 'New Transaction added'
    })
  })


  app.post('/transaction/broadcast', (req, res) => {
    const {sender, recipient, value} = req.body
    const transaction = PurseCoin.createNewTransaction(sender,recipient, value)
    PurseCoin.addToPendingTransaction(transaction)
    let broadcastTransactionPromise = []

    PurseCoin.nodes.map(node => {
      const url = `${node}/transaction`
      const promise = axios.post(url, {transaction})
      broadcastTransactionPromise.push(promise)
    })

    Promise.all(broadcastTransactionPromise).then(response => {
      res.send({
        message: 'Transaction has been broadcast'
      })
    }).catch(err => {
      res.status(400)
      res.send({
        error: "Fail to broadcast transaction"
      })
    })

  })

  app.get('/transaction/pending', (_req, res) => {
      res.send({
          pendingTransactions: PurseCoin.pendingTransactions
      })
  })

  app.get('/transaction/confirmed', (_req, res) => {
      res.send({
          confirmedTransactions: PurseCoin.getConfirmedTransactions()
      })
  })
}


module.exports = transaction
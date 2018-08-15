const transaction = function(app, axios, PurseCoin) {
  app.post('/transaction', (req, res) => {
    const {transaction} = req.body
    PurseCoin.addToPendingTransaction(transaction)
    console.log(PurseCoin.pendingTransactions)
    res.send({
      message: 'New Transaction added'
    })
  })


  app.post('/transaction/broadcast', (req, res) => {
    
    const {sender, recipient, value} = req.body
    const transaction = PurseCoin.createNewTransaction(sender,recipient, value)
    PurseCoin.addToPendingTransaction(transaction)

    console.log("this is my pending transactions: ",PurseCoin.pendingTransactions)

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
}


module.exports = transaction
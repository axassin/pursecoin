const network = function(app, axios, PurseCoin) {

  //broadcast the new node to all connected nodes
  app.post('/network/broadcast', (req, res) => {

    const newNode = req.body.newNode
    //check if new node doesn't exist in current nodes
    if(PurseCoin.nodes.indexOf(newNode) < 0 ) {
      PurseCoin.nodes.push(newNode)

      console.log(PurseCoin.nodes)

      let nodePromises = []
      PurseCoin.nodes.map(node => {
       if(node !== newNode) {
        const url = `${node}/network/register`
        const data = {
          newNode
        }
        const nodeRequest =  axios.post(url, data)
        nodePromises.push(nodeRequest)
       }
      })
  
      Promise.all(nodePromises).then(response => {

        const url = `${newNode}/network/bulk`
        const nodes = [...PurseCoin.nodes, PurseCoin.currentNode]
        const pendingTransactions = PurseCoin.pendingTransactions

        return axios.post(url, {nodes, pendingTransactions})

      }).then(response => {
        console.log('sucess bulking nodes')
      }).then(response => {
        console.log("Done brodcasting transactions to new node")
      }).catch(err => {
        console.log(err)
      })
  
      res.send({
        message: 'brodcast network'
      })

    } else {
      res.status(400)
      res.send({
        error: 'node already registered'
      })
    }
  })

  //register node
  app.post('/network/register', (req, res) => {
    const {newNode} = req.body

    if(PurseCoin.nodes.indexOf(newNode) < 0 && newNode !== PurseCoin.currentNode) {
      PurseCoin.nodes.push(newNode)
      console.log(PurseCoin.nodes)
      res.send({
        message: newNode + ' is connected ' 
      })
    }
  })

  //register all the nodes of the connected node
  app.post('/network/bulk', (req, res) => {
    const {nodes, pendingTransactions} = req.body
    console.log("REQUEST: ",pendingTransactions)
    PurseCoin.nodes = [...PurseCoin.nodes, ...nodes].filter(node => node !== PurseCoin.currentNode)
    PurseCoin.pendingTransactions = [...PurseCoin.pendingTransactions, ...pendingTransactions]
    console.log("pending: "+pendingTransactions)
    console.log("CURRENT NODES: ", PurseCoin.nodes)
    console.log("PENDING TRANSACTIONS: ", PurseCoin.pendingTransactions)
    res.send({
      message:  'Decentralized node'
    })
  })
}


module.exports = network
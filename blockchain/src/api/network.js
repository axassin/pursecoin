
const network = function(app, axios, PurseCoin) {
    
  app.post('/network/broadcast', (req, res) => {

    const newNode = req.body.newNode

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

  app.post('/network/register', (req, res) => {
    const {newNode} = req.body

    if(PurseCoin.nodes.indexOf(newNode) < 0 && newNode !== PurseCoin.currentNode) {
      PurseCoin.nodes.push(newNode)

      res.send({
        message: newNode + ' is connected ' 
      })
    }
  })

  app.post('/network/bulk', (req, res) => {
    const {nodes, pendingTransactions} = req.body
    PurseCoin.bulkNodes(nodes)
    PurseCoin.bulkTransactions(pendingTransactions)

    res.send({
      message:  'Decentralized node'
    })
  })
}


module.exports = network
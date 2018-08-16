
const block = function(app, axios, PurseCoin) {

    app.post('/block/broadcast', (req, res) => {
        const {minedBlock} = req.body
        const lastBlock  = PurseCoin.getLatestBlock()
        const validPrevHash = lastBlock.hash === minedBlock.previousHash
        const validIndex = lastBlock.index + 1 === minedBlock.index
        const validHash = PurseCoin.calculateHash(lastBlock.hash, minedBlock.timestamp, minedBlock.nonce) === minedBlock.hash

        let response = {
            message: "Block Added"
        }

        if(validHash && validPrevHash && validIndex) {
            PurseCoin.registerBlock(minedBlock)
            PurseCoin.removeTxsFromPendingTxs(minedBlock.transactions)
            console.log("MINED BLOCK")
            console.log(minedBlock)
            res.send(response)
            return
        } else {
            console.log("INVALID BLOCK")
        }

        response = {
            error: "Invalid Block or Already mined"
        }
        
        res.send(response)
        return
    })
}

module.exports = block
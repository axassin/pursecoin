
const block = function(app, axios, PurseCoin) {

    app.post('/block/broadcast', (req, res) => {
        const {minedBlock} = req.body

        let response = {
            message: "Block Added"
        }
        if(PurseCoin.isValidBlock(minedBlock)) {
            PurseCoin.registerBlock(minedBlock)
            PurseCoin.removeTxsFromPendingTxs(minedBlock.data)
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
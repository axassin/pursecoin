
const block = function(app, axios, PurseCoin) {
    app.get('/block/chain', (_req, res) => {
        res.send({
            chain: PurseCoin.chain
        })
    })
}

module.exports = block
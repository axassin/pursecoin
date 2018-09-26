
const block = function(app, axios, PurseCoin) {
    app.get('/', (_req, res) => {
        res.send({
            chain: PurseCoin.chain
        })
    })
}

module.exports = block
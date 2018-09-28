
const block = function(app, axios, PurseCoin) {
    app.get('/blocks', (_req, res) => {
        res.send({
            blocks: PurseCoin.chain
        })
    })
}

module.exports = block
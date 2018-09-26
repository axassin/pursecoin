
const block = function(app, axios, PurseCoin) {
    app.get('/balance/confirmed', (_req, res) => {
        res.send({
            confirmedBalances: PurseCoin.getConfirmedBalances()
        })
    })
}

module.exports = block
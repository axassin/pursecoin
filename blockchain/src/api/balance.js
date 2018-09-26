
const block = function(app, axios, PurseCoin) {
    app.get('/balance/confirmed/:address', (req, res) => {

        const address = req.params.address
        const balance = PurseCoin.getConfirmedBalances()[address]
        if(balance) {
            res.send({
                confirmedBalance: balance
            })
        } else {
            res.status(400)
            res.send({
                error: "Address not found"
            })
        }

    })
}

module.exports = block
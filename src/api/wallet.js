const blockchainWallet = require('../wallet')


const wallet = function(app, axios, PurseCoin) {

    app.post('/wallet/generate', (req, res) => {
        const {passphrase} = req.body

        const Wallet = new blockchainWallet

        const filename = Wallet.generateWallet(passphrase)

        let response = {
            message: filename
        }
        
        res.send(response)
        return
    })

    app.post('/wallet/retrieve', (req, res) => {
        const {filename, passphrase} = req.body

        const Wallet = new blockchainWallet

        // let {privateKey, publicKey, publicAddress} = Wallet.retrieveWallet(filename, passphrase)

        res.json(Wallet.retrieveWallet(filename, passphrase))

        return
    })
}

module.exports = wallet
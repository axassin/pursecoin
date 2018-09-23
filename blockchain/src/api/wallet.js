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

        res.json(Wallet.retrieveWallet(filename, passphrase))
        return
    })

    app.post('/wallet/sign', (req, res) => {
        const {transaction, filename, passphrase} = req.body

        const Wallet = new blockchainWallet

        let {privateKey, publicKey} = Wallet.retrieveWallet(filename, passphrase)

        let signature = Wallet.signTransaction(transaction, privateKey)

        res.json(signature)
        return
    })

    app.post('/wallet/verify', (req, res) => {
        const {transaction, signature} = req.body

        const publicKey = transaction["publicKey"]

        const Wallet = new blockchainWallet

        let result = Wallet.verifyTransaction(transaction, publicKey, signature)

        res.send(result)
        return
    })
}

module.exports = wallet
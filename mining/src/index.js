
const mine = require('./mine')
const port = parseInt(process.env.PORT)
const host = process.env.host || 'localhost'
const minerAddress = process.env.MINER_ADDRESS || ''
const url = `http://${host}:${port}/`


const config = {
    port,
    url,
    host,
    minerAddress
}

mine.start(config)

const uuid = require('uuid/v1')
const ec = require('elliptic').ec
const random = require('secure-random')
const CryptoJS = require('crypto-js')
const SHA256 = require('js-sha256')
const ripemd160 = require('ripemd160')
const fs = require('fs')

const walletDirectory = "../wallets/"

function Wallet() {

}
/*(
  COMPLETED:
    Generate Keypair
    Retrieve PubKey using PrivKey
    Retrieve Address using Pub/Priv Key

    Encrypt(
        (username + passphrase) => validation, result saved on first line of file, 
          (private key) => comma separated value)
          e.g. Filename: username
               Contents: [Encryption of name+pass],[encryption of private key]
          User inputs username, pass -> compare with the contents of file(username)

  TODO:
    Sign transaction
    Verify transaction
)*/
Wallet.prototype.generatePublicKeyFromPrivateKey = function(privateKey){
  //convert private key to public key, secp256k1
  let ecdsa = new ec('secp256k1')
  let keys = ecdsa.keyFromPrivate(privateKey)
  let publicKey = keys.getPublic('hex')

  console.log("Public Key Generated: ", publicKey)
  return publicKey
}

Wallet.prototype.generateRandomPrivateKey = function(){
  //generate a random private key

  let privateKey = random.randomBuffer(32) //32byte hex digit
  const max = Buffer.from('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140', 'hex')

  while(Buffer.compare(max, privateKey) === 1){
    privateKey = random.randomBuffer(32)
  }

  privateKey = privateKey.toString('hex')

  console.log("Private Key Generated: ", privateKey)
  return privateKey
}

Wallet.prototype.generateAddressfromPubKey = function(publicKey){
  //generate a public key hash
  let hash = SHA256(Buffer.from(publicKey, 'hex'))
  let publicKeyHash = new ripemd160().update(Buffer.from(hash, 'hex')).digest()

  //generate an address
  const step1 = Buffer.from("00" + publicKeyHash.toString('hex'), 'hex')
  const step2 = SHA256(step1)
  const step3 = SHA256(Buffer.from(step2, 'hex'))
  const checksum = step3.substring(0, 8)
  const step4 = step1.toString('hex') + checksum
  const base58 = require('bs58')
  const publicAddress = base58.encode(Buffer.from(step4, 'hex'))

  console.log(publicAddress)
  return publicAddress
}

Wallet.prototype.createRandomKeyPair = function() {
  let privateKey = generateRandomPrivateKey()
  let publicKey = generatePublicKeyFromPrivateKey(privateKey)
  let publicAddress = generateAddressfromPubKey(publicKey)
  return {privateKey, publicKey, publicAddress}
}

Wallet.prototype.generateWallet = function(passphrase){
  let {privateKey, publicKey, publicAddress} = createRandomKeyPair()
  //Encrypt them
  // let namePhrase = CryptoJS.AES.encrypt(filename+passphrase, passphrase).toString()
  // let data = CryptoJS.AES.encrypt(privateKey+"|"+publicKey+"|"+publicAddress, passphrase).toString()
  // let encryptedWhole = CryptoJS.AES.encrypt(namePhrase+"|"+data).toString()
  
  let filename  = "FancyPurseCoinWalletLMAO_" + Math.round(+ new Date() / 1000) + "_" + Math.random(10000, 10000)+".txt"
  let encryptedWhole = CryptoJS.AES.encrypt(filename+passphrase+","+privateKey+"|"+publicKey+"|"+publicAddress, passphrase).toString()
  // console.log("Encrypted everything: " + encryptedWhole)

  //create file with filename $name, encrypted data, store
  if (!fs.existsSync(walletDirectory)){
    fs.mkdirSync(walletDirectory)
  }


  fs.writeFile(walletDirectory + filename, encryptedWhole, "utf-8", (err) => {
    if (err){
      console.log("Failed to write file")
      throw err
    }
    console.log("File successfully written to " + walletDirectory+filename)
  })

  return filename
}

Wallet.prototype.retrieveWallet = function(filename, passphrase){
  //retrieve file with filename $name
  // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
  // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
  fs.readFile(walletDirectory+filename, "utf8", async(err, file) =>{
    if (err){
      console.log("Failed to read file")
      return
    }

    let initialDecrypt

    try{
      initialDecrypt = CryptoJS.AES.decrypt(file, passphrase).toString(CryptoJS.enc.Utf8).split(",")
    }catch(err){
      console.log("Wrong filename or passphrase")
      return
    }

    let [privateKey, publicKey, publicAddress] = initialDecrypt[1].split("|")

    console.log("Private Key: ", privateKey)
    console.log("Public Key: ", publicKey)
    console.log("Public Address: ", publicAddress)
  })
}

Wallet.prototype.signTransaction = function(wallet, toAddress, value, transaction){

    let transactions = {
        nonce:0,
        gasLimit:21000,
        gasPrice:ethers.utils.bigNumberify("2000000000"),
        to:toAddress,
        value:ethers.utils.parseEther(value),
        data:"0x"
    }
    return wallet.sign(transaction)
}

module.exports = Wallet
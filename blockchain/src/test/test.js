const Blockchain = require('../blockchain')
const PurseCoin = new Blockchain
// const {spawn} = require('child_process')

// const child = spawn('node', ['miner.js',])

// console.log("MINE")
// child.stdout.on('data', (data) => {
//   let json = JSON.stringify(data)
//   let bufferOriginal = Buffer.from(JSON.parse(json).data);
//   console.log(bufferOriginal.toString('utf8'))
//   // console.log(JSON.stringify(json.data))
// });


chain = [
  {
  "index": 0,
  "previousHash": "0",
  "hash": "0",
  "timestamp": 0,
  "data": {
  "0": {
  "recipient": 0,
  "sender": 0,
  "value": 0
  }
  },
  "nonce": 0,
  "minerAddress": 0,
  "difficulty": 4
  },
  {
  "index": 1,
  "previousHash": "0",
  "hash": "0000ccadb7bedbc7148acb2a86ee321e9857d1364acd311b9e2ace4ed3a1f9ff",
  "timestamp": 1534640518.412,
  "data": {
  "6e6e57c0-a34b-11e8-9be9-a5a187db9c80": {
  "sender": "qweqweeeqqqeeeeeqqqqqqqqqqqe",
  "recipient": "qqqqqqqqqqqqqq",
  "value": 100,
  "id": "6e6e57c0-a34b-11e8-9be9-a5a187db9c80"
  }
  },
  "nonce": 59426,
  "minerAddress": "piagwapa",
  "difficulty": 4
  },
  {
  "index": 2,
  "previousHash": "0000ccadb7bedbc7148acb2a86ee321e9857d1364acd311b9e2ace4ed3a1f9ff",
  "hash": "0000bfe2560b00bebb0d7f04d7db5c3ffdd97f635d5d12e8bb9fc607b670ac92",
  "timestamp": 1534640592.779,
  "data": {
  "9dcdb920-a34b-11e8-9be9-a5a187db9c80": {
  "sender": "qweqweeeqqqeeeeeqqqqqqqqqqqe",
  "recipient": "qqqqqqqqqqqqqq",
  "value": 100,
  "id": "9dcdb920-a34b-11e8-9be9-a5a187db9c80"
  },
  "9e3aabc0-a34b-11e8-9be9-a5a187db9c80": {
  "sender": "qweqweeeqqqeeeeeqqqqqqqqqqqe",
  "recipient": "qqqqqqqqqqqqqq",
  "value": 100,
  "id": "9e3aabc0-a34b-11e8-9be9-a5a187db9c80"
  },
  "9ea24730-a34b-11e8-9be9-a5a187db9c80": {
  "sender": "qweqweeeqqqeeeeeqqqqqqqqqqqe",
  "recipient": "qqqqqqqqqqqqqq",
  "value": 100,
  "id": "9ea24730-a34b-11e8-9be9-a5a187db9c80"
  }
  },
  "nonce": 21629,
  "minerAddress": "piagwapa",
  "difficulty": 4
  },
  {
  "index": 3,
  "previousHash": "0000bfe2560b00bebb0d7f04d7db5c3ffdd97f635d5d12e8bb9fc607b670ac92",
  "hash": "000060294362b7fa5f7d1a57d44a54e5b0c9c622f60b7ef33902705d9efb8f5b",
  "timestamp": 1534640602.495,
  "data": {
  "a7cced60-a34b-11e8-9be9-a5a187db9c80": {
  "sender": "qweqweeeqqqeeeeeqqqqqqqqqqqe",
  "recipient": "qqqqqqqqqqqqqq",
  "value": 100,
  "id": "a7cced60-a34b-11e8-9be9-a5a187db9c80"
  },
  "a8310660-a34b-11e8-9be9-a5a187db9c80": {
  "sender": "qweqweeeqqqeeeeeqqqqqqqqqqqe",
  "recipient": "qqqqqqqqqqqqqq",
  "value": 100,
  "id": "a8310660-a34b-11e8-9be9-a5a187db9c80"
  }
  },
  "nonce": 11045,
  "minerAddress": "piagwapa",
  "difficulty": 4
  }
  ]

  console.log(PurseCoin.isValidChain(chain))
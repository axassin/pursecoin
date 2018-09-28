const Block = require('../block')

const block = new Block(
    0,
    [{
        from: 'jio',
        to: 'buaron'
    },
    {
        from: 'jio',
        to: 'buaron'
    }],
    4,
    123,
    'jio',
    undefined,
    1234,
    new Date(),
    undefined
)
block.calculateBlockDataHash()
// block.calculateBlockHash()
console.log(block)
const transactions = {'qwe':{data: [1,2,3],tae: 1},'asd':{data: [4,5,6]},'bmb':{data: [7,8,9]}}
const transaction2 = {'qwe2':{data: [1,2,3]},'asd2':{data: [4,5,6]},'bmb':{data: [7,8,9]}}

blocks = [{transaction: transactions}, {transaction: transaction2}]

let txs = {}

blocks.map(block => {
    txs = {...txs, ...block.transaction}
})


// console.log(txs['qwew'])

// console.log(Object.keys(transactions).filter(tnx => {
//     return transactions[tnx].tae === 1
// }).map(tnx => transactions[tnx]))

const balance = {
    pendingBalance: 0,
    safeBlance: 0
}

balance.pendingBalance =2
balance.tae = 1

console.log(balance)
const blockChainUtil = {}

blockChainUtil.removeObject = (ob, obs) => {
    
    let currObj = obs

    Object.keys(obs).map(_o => {
        if(currObj[ob]) {
            delete currObj[ob]
        }
    })

    return currObj
}

module.exports = blockChainUtil
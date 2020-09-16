require('dotenv').config()
const axios = require('axios')
const BigNumber = require('bignumber.js')
const fs = require('fs');

const Web3 = require('web3')
const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_MAINNET_API_KEY}`)

const ierc20Abi = JSON.parse(fs.readFileSync('ierc20Abi.json', 'utf8'))
const stakingPoolAbi = JSON.parse(fs.readFileSync('PASTA_stakingPoolAbi.json', 'utf8'))

const TOKEN_YFI = 'YFI'
const TOKEN_CREAM = 'CREAM'

const tokenAddresses = {
    [TOKEN_YFI]: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    [TOKEN_CREAM]: '0x2ba592F78dB6436527729929AAf6c908497cB200',
}

const poolAddresses = {
    [TOKEN_YFI]: '0x093430541975e7aa0b2D9De2085BF99F33a5e91C',
    [TOKEN_CREAM]: '0xF774584b6d12A3F93bD7b5FC20A44549cc5e2f07'
}

const geckoIds = {
    [TOKEN_YFI]: 'yearn-finance',
    [TOKEN_CREAM]: 'cream-2'
}

const tokens = [
    TOKEN_YFI
]

const getTokenInstance = name => {
    return new web3.eth.Contract(
        ierc20Abi,
        tokenAddresses[name]
    )
}

const getPoolInstance = name => {
    return new web3.eth.Contract(
        stakingPoolAbi,
        poolAddresses[name]
    )
}

const getUsdPrice = async token => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${geckoIds[token]}&vs_currencies=usd`
    return (await axios.get(url)).data[geckoIds[token]].usd;
};

(async () => {
    const mainTokenUSD = await getUsdPrice(TOKEN_CREAM)
    const stakedAmount = 100000
    let totalLockedValue = 0
    for (let _token of tokens) {
        const token = getTokenInstance(_token)
        const tokenUSD = await getUsdPrice(_token)
        const poolTokenBalance = 10000
        // const poolTokenBalance = web3.utils.fromWei(
        //     await token.methods.balanceOf(poolAddresses[_token]).call(),
        //     'ether'
        // )
        const poolTokenBalanceUsd = (tokenUSD) * poolTokenBalance

        const pool = getPoolInstance(_token)
        // const rewardRate = await pool.methods.rewardRate().call() / 1e18
        const rewardRate = 1500 / 604800
        const rewardRateDay = rewardRate * 86400
        const rewardPerToken = rewardRateDay / poolTokenBalance
        const rewardDailyEstimate = rewardPerToken * stakedAmount / tokenUSD;

        console.log('#### ' + _token + ' ####')
        console.log('Staked ' + Math.round(poolTokenBalance) + _token + ' = $' + (poolTokenBalanceUsd / 1000000).toFixed(2) + 'M')
        console.log('Pool total rewards ' + Math.round(rewardRateDay) + ' ' + TOKEN_CREAM + '/day = $' + (rewardRateDay * mainTokenUSD / 1000).toFixed(2) + 'k')
        console.log('$' + stakedAmount / 1000 + 'k stake rewards ' + (rewardDailyEstimate).toFixed(2) + ' ' + TOKEN_CREAM + '/day = $' + (rewardDailyEstimate * mainTokenUSD / 1000).toFixed(2) + 'k')
        console.log('APY : ' + (rewardPerToken * mainTokenUSD * 100 / tokenUSD * 365 + 0.03).toFixed(2) + '%')

        totalLockedValue += poolTokenBalanceUsd;
    }

    console.log('#### TVL ### : $' + (totalLockedValue / 1000000).toFixed(2) + 'M')
})()

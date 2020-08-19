require('dotenv').config()
const axios = require('axios')
const BigNumber = require('bignumber.js')
const fs = require('fs');

const Web3 = require('web3')
const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_MAINNET_API_KEY}`)

const ierc20Abi = JSON.parse(fs.readFileSync('ierc20Abi.json', 'utf8'))
const stakingPoolAbi = JSON.parse(fs.readFileSync('PASTA_stakingPoolAbi.json', 'utf8'))

const TOKEN_YFI = 'YFI'
const TOKEN_LINK = 'LINK'
const TOKEN_LEND = 'LEND'
const TOKEN_COMP = 'COMP'
const TOKEN_MKR = 'MKR'
const TOKEN_SNX = 'SNX'
const TOKEN_BTC = 'WBTC'
const TOKEN_ETH = 'WETH'

const tokenAddresses = {
    [TOKEN_YFI]: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    [TOKEN_LINK]: '0x29e240cfd7946ba20895a7a02edb25c210f9f324',
    [TOKEN_LEND]: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
    [TOKEN_COMP]: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    [TOKEN_MKR]: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    [TOKEN_SNX]: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
    [TOKEN_BTC]: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    [TOKEN_ETH]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
}

const poolAddresses = {
    [TOKEN_YFI]: '0x093430541975e7aa0b2D9De2085BF99F33a5e91C',
    [TOKEN_LINK]: '0xF774584b6d12A3F93bD7b5FC20A44549cc5e2f07',
    [TOKEN_LEND]: '0xc98161569F57bE86D4D22B5b3228718F9F7101ad',
    [TOKEN_COMP]: '0x31A5F7a7a12af1A317491b1285C59E63e16654A1',
    [TOKEN_MKR]: '0x6a3F3e76ad1EE05f5382D79F9047eFfD8417670c',
    [TOKEN_SNX]: '0xF3a68aA38d8f54AFaAD90CD98E71e88eCc021E23',
    [TOKEN_BTC]: '0x1e237Fb9a94Ae18e9007B6661a974962253Df0c8',
    [TOKEN_ETH]: '0x4547a86cA6a84b9D60DC57aF908472074DE7af5F'
}

const geckoIds = {
    [TOKEN_YFI]: 'yearn-finance',
    [TOKEN_LINK]: 'chainlink',
    [TOKEN_LEND]: 'ethlend',
    [TOKEN_COMP]: 'compound-governance-token',
    [TOKEN_MKR]: 'maker',
    [TOKEN_SNX]: 'havven',
    [TOKEN_BTC]: 'wrapped-bitcoin',
    [TOKEN_ETH]: 'weth'
}

const tokens = [
    TOKEN_YFI,
    TOKEN_LINK,
    TOKEN_LEND,
    TOKEN_COMP,
    TOKEN_MKR,
    TOKEN_SNX,
    TOKEN_BTC,
    TOKEN_ETH
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

const getUsdPrice = async sym => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${sym}&vs_currencies=usd`
    return (await axios.get(url)).data[sym].usd;
};

(async () => {
    const PASTA_USD = await getUsdPrice('spaghetti')
    const stakedAmount = 100000
    let totalLockedValue = 0
    for (let _token of tokens) {
        const token = getTokenInstance(_token)
        const tokenUSD = await getUsdPrice(geckoIds[_token])
        const poolTokenBalance = web3.utils.fromWei(
            await token.methods.balanceOf(poolAddresses[_token]).call(),
            'ether'
        )
        const poolTokenBalanceUsd = (tokenUSD) * poolTokenBalance

        const pool = getPoolInstance(_token)
        const rewardRate = await pool.methods.rewardRate().call() / 1e18
        const rewardRateDay = Math.round(rewardRate * 86400)
        const rewardPerToken = rewardRateDay / poolTokenBalance
        const rewardDailyEstimate = rewardPerToken * stakedAmount / tokenUSD;

        console.log('#### ' + _token + ' ####')
        console.log('Staked ' + Math.round(poolTokenBalance) + _token + ' = $' + (poolTokenBalanceUsd / 1000000).toFixed(2) + 'M')
        console.log('Pool total rewards ' + Math.round(rewardRateDay) + ' PASTA/day = $' + (rewardRateDay * PASTA_USD / 1000).toFixed(2) + 'k')
        console.log('$' + stakedAmount / 1000 + 'k stake rewards ' + Math.round(rewardDailyEstimate) + ' PASTA/day = $' + (rewardDailyEstimate * PASTA_USD / 1000).toFixed(2) + 'k')
        console.log('APY : ' + (rewardPerToken * PASTA_USD * 100 / tokenUSD * 365).toFixed(2) + '%')

        totalLockedValue += poolTokenBalanceUsd;
    }

    console.log('#### TVL ### : $' + (totalLockedValue / 1000000).toFixed(2) + 'M')
})()

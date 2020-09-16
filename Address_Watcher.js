require('dotenv').config()
const axios = require('axios')
const BigNumber = require('bignumber.js')
const fs = require('fs');
const Web3 = require('web3');

const web3http = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_MAINNET_API_KEY}`))
const web3 = new Web3(new Web3.providers.WebsocketProvider(`wss://mainnet.infura.io/ws/v3/${process.env.INFURA_MAINNET_API_KEY}`))

const watchlist = [
    { name: 'Yearn deployer', address: '0x2D407dDb06311396fE14D4b49da5F0471447d45C'.toLowerCase() },
    { name: 'Curve deployer', address: '0xC447FcAF1dEf19A583F97b3620627BF69c05b5fB'.toLowerCase() },
    { name: 'Curve deployer 2', address: '0xbabe61887f1de2713c6f97e567623453d3C79f67'.toLowerCase() },
    { name: 'MakerDAO deployer 1', address: '0x4f26ffbe5f04ed43630fdc30a87638d53d0b0876'.toLowerCase() },
    { name: 'MakerDAO deployer 2', address: '0xdb33dfd3d61308c33c63209845dad3e6bfb2c674'.toLowerCase() },
    { name: 'MakerDAO deployer 3', address: '0x00daa9a2d88bed5a29a6ca93e0b7d860cd1d403f'.toLowerCase() },
    { name: 'MakerDAO deployer 4', address: '0xddb108893104de4e1c6d0e47c42237db4e617acc'.toLowerCase() },
    { name: 'Melon deployer', address: '0x0d580ae50b58fe08514deab4e38c0dfdb0d30adc'.toLowerCase() },
    { name: 'Synthetix deployer 1', address: '0xde910777c787903f78c89e7a0bf7f4c435cbb1fe'.toLowerCase() },
    { name: 'Synthetix deployer 2', address: '0xe88ada0408f187c17eedd256a0495d8e3766aac4'.toLowerCase() },
    { name: 'Synthetix deployer 3', address: '0xb64ff7a4a33acdf48d97dab0d764afd0f6176882'.toLowerCase() },
    { name: 'Synthetix deployer 4', address: '0x77a2cd8e930eacf196105ca06837d8b3edecf1a5'.toLowerCase() },
    { name: 'Synthetix deployer 5', address: '0xea5e288b4f9d7e66da162e2af0db371783f62454'.toLowerCase() },
    { name: 'Synthetix deployer 6', address: '0xccf1242cb1d7d56b428dac2bd68a5cace1b067e7'.toLowerCase() },
    { name: 'Synthetix deployer 7', address: '0xb10c85274d2a58ddec72c1d826e75256ff93dead'.toLowerCase() },
    { name: 'Synthetix deployer 8', address: '0xaf28cec7854e9a070f4cd31f18ba005f874d9f50'.toLowerCase() },
    { name: 'Synthetix deployer 9', address: '0xde91067660f6e19ae03fba96d6926a0897b5f5be'.toLowerCase() },
    { name: 'Synthetix deployer 10', address: '0xf2827848dbee5d46e9c7c4c3f5e197e3af811105'.toLowerCase() },
    { name: 'Bancor deployer 1', address: '0xdfee8dc240c6cadc2c7f7f9c257c259914dea84e'.toLowerCase() },
    { name: 'Bancor deployer 2', address: '0x009bb5e9fcf28e5e601b7d0e9e821da6365d0a9c'.toLowerCase() },
    { name: 'Bancor deployer 3', address: '0xc8021b971e69e60c5deede19528b33dcd52cdbd8'.toLowerCase() },
    { name: 'Bancor deployer 4', address: '0xf2ad4572ce38408ac846852a8a2b361ecb76e4fb'.toLowerCase() },
    { name: 'Jarvis deployer', address: '0x0d54aadd7ce2dc10eb9527c6105a3c3f1b463d1b'.toLowerCase() },
    { name: 'Chainlink deployer', address: '0x6f61507f902e1c22bcd7aa2c0452cd2212009b61'.toLowerCase() },
    { name: 'dForce deployer', address: '0x377598d56030b2d6a9e83f20d44ba3b10ddfa2d5'.toLowerCase() },
    { name: 'Bitfinex Deployer 1', address: '0x5dbdebcae07cc958ba5290ff9deaae554e29e7b4'.toLowerCase() },
    { name: 'Bitfinex Deployer 2', address: '0x2ee3b2df6534abc759ffe994f7b8dcdfaa02cd31'.toLowerCase() },
    { name: 'Bitfinex Deployer 3', address: '0xe1f3c653248de6894d683cb2f10de7ca2253046f'.toLowerCase() },
    { name: 'Bitfinex Deployer 4', address: '0x2903cadbe271e057edef157340b52a5898d7424f'.toLowerCase() },
    { name: 'Bitfinex Deployer 5', address: '0x36928500bc1dcd7af6a2b4008875cc336b927d57'.toLowerCase() },
    { name: 'Bitfinex Deployer 6', address: '0x14d06788090769f669427b6aea1c0240d2321f34'.toLowerCase() },
    { name: 'Kyber Deployer 1', address: '0x8007ce15acda724689760b4ba493d4766f973649'.toLowerCase() },
    { name: 'Kyber Deployer 2', address: '0xe79bc2c998ff2a154ae35bb7ce68555e7fc94ef9'.toLowerCase() },
    { name: 'Kyber Deployer 3', address: '0xbdd33f411da0b40018922a3bc69001b458227f5c'.toLowerCase() },
    { name: 'Kyber Deployer 4', address: '0x346fbe5d02c89fb4599f33bdce987981d573740a'.toLowerCase() },
    { name: 'IDEX Deployer', address: '0x33daedabab9085bd1a94460a652e7ffff592dfe3'.toLowerCase() },
    { name: 'Zapper.Fi Deployer 1', address: '0x19627796b318e27c333530ad67c464cfc37596ec'.toLowerCase() },
    { name: 'Zapper.Fi Deployer 2', address: '0xa0863436913b1b439ccaa6fbf89408116c1dde29'.toLowerCase() },
    { name: 'Ren Deployer', address: '0xfe45ab17919759cfa2ce35215ead5ca4d1fc73c7'.toLowerCase() },
    { name: 'ParaSwap Deployer 1', address: '0x60fb0b38ff0fcb98462e70aa5da4dff047635ec3'.toLowerCase() },
    { name: 'ParaSwap Deployer 2', address: '0xe6b692dcc972b9a5c3c414ac75ddc420b9edc92d'.toLowerCase() },
    { name: 'Opyn Deployer', address: '0x9e68b67660c223b3e0634d851f5df821e0e17d84'.toLowerCase() },
    { name: 'Aave Deployer 1', address: '0xfe1a6056ee03235f30f7a48407a5673bbf25ed48'.toLowerCase() },
    { name: 'Aave Deployer 2', address: '0x2fbb0c60a41cb7ea5323071624dcead3d213d0fa'.toLowerCase() },
    { name: 'Cream Deployer', address: '0x197939c1ca20C2b506d6811d8B6CDB3394471074'.toLowerCase() },
    { name: 'Uniswap Deployer 2', address: '0x9C33eaCc2F50E39940D3AfaF2c7B8246B681A374'.toLowerCase() },


    { name: 'yearn gov stake', address: '0xBa37B002AbaFDd8E89a1995dA52740bbC013D992'.toLowerCase() }
]

const getUsdPrice = async token => {
    try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${geckoIds[token]}&vs_currencies=usd`
        return (await axios.get(url)).data[geckoIds[token]].usd;
    } catch (err) {
        console.error(err);
    }
};

const subscription = web3.eth.subscribe('pendingTransactions', (err, res) => {
    if (err) console.error(err);
});

const watchTransactions = () => {
    console.log('[+] Watching transactions...');
    subscription.on('data', (txHash) => {
        setTimeout(async () => {
            try {
                let tx = await web3http.eth.getTransaction(txHash);
                if (tx.to) {
                    if (tx.to.toLowerCase() === address) {
                        console.log({ address: tx.from, value: web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date() });
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }, 60 * 1000);
    });
}

const checkLastBlock = async () => {
    let block = await web3.eth.getBlock('latest');
    console.log(`[*] Searching block ${block.number}...`);
    if (block && block.transactions) {
        for (let tx of block.transactions) {
            let transaction = await web3.eth.getTransaction(tx);
            if (address === transaction.to.toLowerCase()) {
                console.log(`[+] Transaction found on block ${lastBlockNumber}`);
                console.log({ address: transaction.from, value: web3.utils.fromWei(transaction.value, 'ether'), timestamp: new Date() });
            }
        }
    }
}

const checkBlocks = async (start, end) => {
    for (let i = start; i < end; i++) {
        let block = await web3.eth.getBlock(i)
        console.log(`[*] Searching block ${i}`);
        if (block && block.transactions) {
            for (let tx of block.transactions) {
                let transaction = await web3.eth.getTransaction(tx);
                if (address === transaction.to.toLowerCase()) {
                    console.log(`[+] Transaction found on block ${lastBlockNumber}`);
                    console.log({ address: transaction.from, value: web3.utils.fromWei(transaction.value, 'ether'), timestamp: new Date() });
                }
            }
        }
    }
}

(async () => {
    // const gweiBalance = await web3http.eth.getBalance(address)
    // const balance = web3http.utils.fromWei(gweiBalance, 'ether')

    // console.log(balance)
    // const tx = await web3http.eth.getTransaction('0x78482c7be801dfe75e399d9bf44acdbc7ab2cab100a9e33ee963513b272ee579');
    // console.log(tx)

    const addresses = watchlist.map(x => x.address)
    let subscription = web3.eth.subscribe('logs', {
        address: addresses
    }, async function (error, result) {
        if (error)
            console.error(result);
        else {
            const tx = await web3http.eth.getTransaction(result.transactionHash);
            // if (tx.to == null)
            console.log('possible deployment', watchlist.filter(x => x.address == tx.from.toLowerCase() || x.address == tx.to.toLowerCase())[0].name, tx)
        }

    })
        .on("error", (error) => console.error(error))
        .on("connected", (subscriptionId) => console.log('started', subscriptionId))

    // setInterval(() => {
    //     checkLastBlock()
    // }, 2000)
})();
const InputDataDecoder = require('ethereum-input-data-decoder');
const BigNumber = require('bignumber.js');
const moment = require('moment');
const axios = require('axios');
const Web3 = require('web3');
const fs = require('fs');
require('dotenv').config();

const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_MAINNET_API_KEY}`))
const decoder = new InputDataDecoder(`${__dirname}/SakeMasterAbi.json`);
const tlDecoder = new InputDataDecoder(`${__dirname}/TimeLockAbi.json`);
//Exported from Etherscan: Incoming transactions to the TimeLock contract (0x2Ba614b6ca210fa4961C923dCF7910413B0f93be)
const txHashs = JSON.parse(fs.readFileSync(`${__dirname}/SakeTimelockTransactions.json`));

class TimeLockTx {
    constructor(txId, createdAt, eta, method, data) {
        this.txId = txId;
        this.createdAt = createdAt;
        this.eta = eta;
        this.method = method;
        this.data = data;
    }
}

const getTokens = async (pool) => {
    try {
        const res = await axios.post("https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2", {
            query: `query pair {
            pair(id: "${pool}") {
                token0{
                    name
                }
                token1{
                    name
                }
            }
        }
        `
        });
        return [res.data.data.pair.token0.name, res.data.data.pair.token1.name]
    } catch (e) {
        console.error('Non uni pool')
        return [false, false]
    }
}

    ; (async () => {
        const tlTxs = []
        for (const txHash of txHashs) {
            const txResult = await web3.eth.getTransaction(txHash)
            const blockResult = await web3.eth.getBlock(txResult.blockNumber)

            const instructions = txResult.input.slice(10).match(/.{1,64}/g);
            const instructionsData = instructions.slice(instructions.findIndex(y => y == instructions.filter(x => x.slice(x.length - 4) === '0064')[0]) + 1).join('')

            const tlResult = tlDecoder.decodeData(txResult.input);
            const dResult = decoder.decodeData(instructionsData);

            let args = ''
            if (dResult.method == 'set')
                args = 'Pool ' + new BigNumber(dResult.inputs[0]).toString(10) + ' alloc ' + new BigNumber(dResult.inputs[1]).toString(10)
            else if (dResult.method == 'add') {

                const pair = await getTokens('0x' + dResult.inputs[1])
                args = 'LP ' + ((pair[0] && pair[1]) ? pair[0] + '/' + pair[1] : dResult.inputs[1]) + ' alloc ' + new BigNumber(dResult.inputs[0]).toString(10)
            }

            const tlTx = new TimeLockTx(txResult.hash, blockResult.timestamp, tlResult.inputs[tlResult.names.indexOf('eta')].toNumber(10), dResult.method, args)
            tlTxs.push(tlTx)

            //Printing format for unexpected calls, unstructured

            // console.log('---TX', txResult.hash, '--Sent', moment().diff(moment.unix(blockResult.timestamp), 'hours'), 'hours ago')
            //     tlResult.inputs.forEach((tlItem, tlIndex) => {
            //         if (tlResult.names[tlIndex] == 'eta')
            //             console.log('   ', tlResult.types[tlIndex], tlResult.names[tlIndex], moment().diff(moment.unix(tlItem.toNumber()), 'hours'), 'hours ago')
            //         else if (tlResult.types[tlIndex] == 'uint256')
            //             console.log('   ', tlResult.types[tlIndex], tlResult.names[tlIndex], new BigNumber(tlItem).toString(10))
            //         else if (tlResult.names[tlIndex] == 'data') {
            //             console.log('   ', tlResult.method, '(')
            //             console.log('      ', dResult.method, '(')
            //             dResult.inputs.forEach((dItem, dIndex) => {
            //                 let typedDItem = dItem
            //                 if (dResult.types[dIndex] == 'uint256')
            //                     typedDItem = new BigNumber(dItem).toNumber()

            //                 console.log('         ', dResult.types[dIndex], dResult.names[dIndex], typedDItem)
            //             })
            //             console.log('      )')
            //             console.log('   )')
            //         }
            //         else
            //             console.log('   ', tlResult.types[tlIndex], tlResult.names[tlIndex], tlItem)
            //     })
        }

        // console.log(tlTxs)
        tlTxs.forEach((x, i) => { console.log('#' + i, x.method, x.data); console.log('Sent', moment.unix(x.createdAt).format('D/M hh:mm:ss'), 'ETA', moment.unix(x.eta).format('D/M hh:mm:ss')) })
    })();
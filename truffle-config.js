// truffle.js config for klaytn.
const HDWalletProvider = require('truffle-hdwallet-provider-klaytn')
const NETWORK_ID = '1001'
const GASLIMIT = '20000000'
const URL = 'https://api.baobab.klaytn.net:8651'
const PV_KEY = '0xf495617e064dcc1b61197eea39b8090eef6dfaa6234808fe3939c558ca1ddb2f'


module.exports = {
    compilers: {
        solc : {
            version : "^0.8.13"
        }
    },
    networks: {
        klaytn: {
            provider : new HDWalletProvider(PV_KEY, URL),
            network_id: NETWORK_ID,
            gas: GASLIMIT,
            gasPrice: null,
        }
    },

}
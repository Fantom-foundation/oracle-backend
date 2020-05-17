const Web3 = require('web3');
const config = require('../config');
const oracleAbi = require('../public/contractAbis/abis');
const TransactionHandler = require('./transactionsHandler');

class ContractHandler {
    constructor(endpoint, contractAddress, oracleAbi) {
        this.endpoint = config.oracleContract.defaultHost + ":" + config.oracleContract.defaultPort;
        this.contractAddress = config.oracleContract.contractAddress;
        this.web3 = new Web3(new Web3.providers.HttpProvider(endpoint));
        this._oracle = new this.web3.eth.Contract(oracleAbi, this.contractAddress); // abi
        this.transactions = new TransactionHandler(this.web3, this._oracle, this.contractAddress, this.txStorage);
    }

    updatePairPrice(pair1, pair2, price) {
        this.transactions.proposePriceForPair(pair1, pair2, price);
    }
}
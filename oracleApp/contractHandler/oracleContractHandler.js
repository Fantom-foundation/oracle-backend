const Web3 = require('web3');
const config = require('../config');
const oracleAbi = require('../public/contractAbis/abis');
const TransactionHandler = require('./transactionsHandler');
const EventsHandler = require('./eventsHandler');

class ContractHandler {
    constructor() {
        this.endpointWs = `ws://${config.oracleContract.defaultHost}:${config.oracleContract.defaultPortWs}`;
        this.endpointRpc = `ws://${config.oracleContract.defaultHost}:${config.oracleContract.defaultPortRpc}`;
        this.contractAddress = config.oracleContract.contractAddress;
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(this.endpoint));
        this._oracle = new this.web3.eth.Contract(oracleAbi, this.contractAddress); // abi
        this.transactions = new TransactionHandler(this.web3, this._oracle, this.contractAddress, this.txStorage);
        this.eventsHandler = new EventsHandler(this.web3);
    }

    async updatePairPrice(pair1, pair2, price) {
        await this.transactions.proposePriceForPair(pair1, pair2, price);
    }

    async handlePriceUpdateRequest(func) {
        this.eventsHandler(func, "UpdatePriceForPair");
    }
}

module.exports = ContractHandler;
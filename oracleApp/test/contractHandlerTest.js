const assert = require("assert");
const config = require('../config');
const oracleAbi = require('../public/contractAbis/abis');

var { FakeWeb3 } = require("./web3FakeProvider/fakeWeb3");

var TransactionHandler = require("../contractHandler/transactionsHandler");
var EventsHandler = require("../contractHandler/eventsHandler");

describe('transaction handler tests', function () {
    beforeEach(function () {
        this.fakeWeb3Provider = new FakeWeb3();
        this.oracle = new this.fakeWeb3Provider.eth.Contract(oracleAbi, config.oracleContract.contractAddress);
        this.transacitonsHandler = new TransactionHandler(this.fakeWeb3Provider, this.oracle);
    });

    afterEach(function () {
        this.fakeWeb3Provider = new FakeWeb3();
    });

    it('propose price for pair - valid', async function () {
        this.fakeWeb3Provider.eth.getTransactionCountExpectCount = 10;
        this.fakeWeb3Provider.eth.getTransactionCountExpectAddress = config.oracleContract.sender.keyObject.address;
        this.fakeWeb3Provider.eth.getGasPriceExpectGas = 21000;
        this.fakeWeb3Provider.eth.estimateGasExpectGas = 2300;

        this.fakeWeb3Provider.eth.accounts.signTransactionRawTxExpect = {
            from: config.oracleContract.sender.keyObject.address,
            to: config.oracleContract.contractAddress,
            value: '0x0',
            gasPrice: "0x5208",
            nonce: '0xa',
            data: `SYMB1/SYMB2 - 2000`,
            gasLimit: "0x8fc"
        };
        this.fakeWeb3Provider.eth.accounts.signTransactionPrivateKeyExpect = config.oracleContract.sender.privateKey;
        this.fakeWeb3Provider.eth.accounts.signTransactionRawTransactionExpect = "signTransactionTest";

        this.fakeWeb3Provider.eth.sendSignedTransactionTxRawTransactionExpect = 'signTransactionTest';
        this.fakeWeb3Provider.eth.sendSignedTransactionErrExpect = null;
        this.fakeWeb3Provider.eth.sendSignedTransactionTxHashExpect = 'signTransactionTest';

        const rawTx = await this.transacitonsHandler.proposePriceForPair("SYMB1", "SYMB2", 2000);
        await assert.equal(rawTx, this.fakeWeb3Provider.eth.accounts.signTransactionRawTransactionExpect);
    });

    it('propose price for pair - send signed transaction error', async function () {
        this.fakeWeb3Provider.eth.getTransactionCountExpectCount = 10;
        this.fakeWeb3Provider.eth.getTransactionCountExpectAddress = config.oracleContract.sender.keyObject.address;
        this.fakeWeb3Provider.eth.getGasPriceExpectGas = 21000;
        this.fakeWeb3Provider.eth.estimateGasExpectGas = 2300;

        this.fakeWeb3Provider.eth.accounts.signTransactionRawTxExpect = {
            from: config.oracleContract.sender.keyObject.address,
            to: config.oracleContract.contractAddress,
            value: '0x0',
            gasPrice: "0x5208",
            nonce: '0xa',
            data: `SYMB1/SYMB2 - 2000`,
            gasLimit: "0x8fc"
        };
        this.fakeWeb3Provider.eth.accounts.signTransactionPrivateKeyExpect = config.oracleContract.sender.privateKey;
        this.fakeWeb3Provider.eth.accounts.signTransactionRawTransactionExpect = "testHash";

        this.fakeWeb3Provider.eth.sendSignedTransactionTxRawTransactionExpect = 'testHash';
        this.fakeWeb3Provider.eth.sendSignedTransactionErrExpect = new Error("sendSignedTransaction error");
        this.fakeWeb3Provider.eth.sendSignedTransactionTxHashExpect = undefined;

        const rawTx = await this.transacitonsHandler.proposePriceForPair("SYMB1", "SYMB2", 2000);
        await assert.equal(rawTx, this.fakeWeb3Provider.eth.accounts.rawTransactionExpect);
    });
});

describe('events handler tests', function () {
    beforeEach(function () {
        this.fakeWeb3Provider = new FakeWeb3();
        this.oracle = new this.fakeWeb3Provider.eth.Contract(oracleAbi, config.oracleContract.contractAddress);
        this.eventsHandler = new EventsHandler(this.fakeWeb3Provider, this.oracle);
    });

    afterEach(function () {
        this.fakeWeb3Provider = new FakeWeb3();
    });

    it('price update request - valid', async function () {
        this.fakeWeb3Provider.eth.subscribeThemeExpect = 'logs';
        this.fakeWeb3Provider.eth.subscribeObjExpect = {
            address: config.oracleContract.contractAddress,
            topics: ['test']
        };
        this.fakeWeb3Provider.eth.subscribeErrExpect = null;
        this.fakeWeb3Provider.eth.subscribeResExpect = {
            data: 'testData',
            topics: ['testTopic'],
        };
        this.fakeWeb3Provider.eth.subscribeReturnsExpect = 'subscribeTest';

        this.fakeWeb3Provider.eth.abi.decodeLogInputsExpect = [
            {
                indexed: false,
                internalType: "string",
                name: "symb1",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "symb2",
                type: "string",
            },
        ];
        this.fakeWeb3Provider.eth.abi.decodeLogDataExpect = 'testData';
        this.fakeWeb3Provider.eth.abi.decodeLogTopicExpect = [];
        this.fakeWeb3Provider.eth.abi.decodeLogReturnsExpect = {
            symb1: 'SYMB1',
            symb2: 'SYMB2',
        };

        await this.eventsHandler.handleEvent((s1, s2) => {
            console.log(`handleEvent - s1:${s1}; s2:${s2}`);
        }, "UpdatePriceForPair");

        await assert.deepEqual(this.eventsHandler.subscribedEvents, {
            "UpdatePriceForPair": ['subscribeTest']
        })
    });

    it('price update request - subscribe error', async function () {
        this.fakeWeb3Provider.eth.subscribeThemeExpect = 'logs';
        this.fakeWeb3Provider.eth.subscribeObjExpect = {
            address: config.oracleContract.contractAddress,
            topics: ['test']
        };
        this.fakeWeb3Provider.eth.subscribeErrExpect = new Error('subscribe error');
        this.fakeWeb3Provider.eth.subscribeResExpect = undefined;
        this.fakeWeb3Provider.eth.subscribeReturnsExpect = undefined;

        await this.eventsHandler.handleEvent((s1, s2) => {
            console.log(`handleEvent - s1:${s1}; s2:${s2}`);
        }, "UpdatePriceForPair");

        await assert.deepEqual(this.eventsHandler.subscribedEvents, {})
    });
});
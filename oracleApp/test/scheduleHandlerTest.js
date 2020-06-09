const { FakeWeb3 } = require("./web3FakeProvider/fakeWeb3")
const assert = require('assert');

var oracleContractHandler = require("../contractHandler/oracleContractHandler");
var schedule = require("../scheduler/scheduleHandler");
var priceJobs = require("../scheduler/priceJobs");
var config = require('../config');

describe("Oracle check schedule tests", function () {
    beforeEach(function () {
        priceJobs.sources[0].requester = null;
        this.fakeWeb3Provider = new FakeWeb3();
        this.oracleContractHandler = new oracleContractHandler(this.fakeWeb3Provider);
    });

    afterEach(function () {
        this.fakeWeb3Provider = new FakeWeb3();
    });

    it('check all prices job', function () {
        var expectResult = new Map();
        expectResult.set("SYMB1/SYMB2", "10000");

        var actual = priceJobs.allPricesJob();

        for (let key of expectResult.keys()) {
            assert.equal(expectResult.get(key), actual.get(key));
        }
    });

    it('check get price for pair', function () {
        var actual = priceJobs.getPriceForPair("SYMB1", "SYMB2");
        assert.equal("10000", actual);
    });

    it('check schedule', async function () {
        // web3.eth.getTransactionCount() expectations
        this.fakeWeb3Provider.eth.getTransactionCountExpectCount = 10;
        this.fakeWeb3Provider.eth.getTransactionCountExpectAddress = config.oracleContract.sender.keyObject.address;
        
        // web3.eth.getGasPrice() expectations
        this.fakeWeb3Provider.eth.getGasPriceExpectGas = 21000;
        
        // web3.eth.estimateGas() expectations
        this.fakeWeb3Provider.eth.estimateGasExpectGas = 2300;

        // web3.eth.accounts.signTransaction() expectations
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

        // web3.eth.sendSignedTransaction() expectations
        this.fakeWeb3Provider.eth.sendSignedTransactionTxRawTransactionExpect = 'testHash';
        this.fakeWeb3Provider.eth.sendSignedTransactionErrExpect = null;
        this.fakeWeb3Provider.eth.sendSignedTransactionTxHashExpect = 'testHash';

        // web3.eth.subscribe() expectations
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

        // web3.eth.abi.decodeLog() expectations
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

        await schedule(this.oracleContractHandler);

        await assert.deepEqual(this.oracleContractHandler.eventsHandler.subscribedEvents, {
            "UpdatePriceForPair": ['subscribeTest']
        })
    });
})

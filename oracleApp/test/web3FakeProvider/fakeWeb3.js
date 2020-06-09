const assert = require('assert');
const _ = require('lodash');
const BN = require('bn.js');
const Web3 = require("web3");

class ABI {
    constructor() {
        this.decodeLogInputsExpect = [];
        this.decodeLogDataExpect = {};
        this.decodeLogTopicExpect = [];
        this.decodeLogReturnsExpect = {
            symb1: '',
            symb2: '',
        };
    }

    decodeLog(inputs, data, topic) {
        assert.deepEqual(inputs, this.decodeLogInputsExpect);
        assert.deepEqual(data, this.decodeLogDataExpect);
        assert.deepEqual(topic, this.decodeLogTopicExpect);
        return this.decodeLogReturnsExpect;
    }
}

class Accounts {
    constructor() {
        this.signTransactionRawTxExpect = {
            from: "",
            to: "",
            value: '',
            gasPrice: '',
            nonce: '',
            data: "",
            gasLimit: '',
        };
        this.signTransactionPrivateKeyExpect = '';
        this.signTransactionRawTransactionExpect = '';
    }

    signTransaction(rawTx, privateKey) {
        assert(rawTx, this.signTransactionRawTxExpect);
        assert.equal(privateKey, this.signTransactionPrivateKeyExpect);
        return {
            rawTransaction: this.signTransactionRawTransactionExpect,
        }
    }
}

class Contract {
    constructor(abi, address) {
        this._jsonInterface = abi;
        this.options = { abi, address };
        this.methods = {
            proposePriceForPair: function (symb1, symb2, price) {
                return {
                    encodeABI: function () {
                        return `${symb1}/${symb2} - ${price}`;
                    }
                }
            }
        }
    }
}

class FakeEth {
    constructor() {
        this.getTransactionCountExpectCount = 0
        this.getTransactionCountExpectAddress = ""

        this.getGasPriceExpectGas = 0;

        this.estimateGasExpectErr = null;
        this.estimateGasExpectGas = 0;

        this.sendSignedTransactionTxRawTransactionExpect = '';
        this.sendSignedTransactionTxHashExpect = '';
        this.sendSignedTransactionErrExpect = null;
        this.sendSignedTransactionExceptionExpect = '';

        this.subscribeThemeExpect = '';
        this.subscribeObjExpect = {};
        this.subscribeReturnsExpect = null;
        this.subscribeErrExpect = null;
        this.subscribeResExpect = {
            data: '',
            topics: [],
        };

        this.Contract = Contract;
        this.accounts = new Accounts();
        this.abi = new ABI();
    }

    getTransactionCount(address) {
        if (address !== this.getTransactionCountExpectAddress) {
            throw new Error(`expectation fail, expected:${this.getTransactionCountExpectAddress}, actual:${address}`);
        }
        return this.getTransactionCountExpectCount;
    }

    getGasPrice() {
        return this.getGasPriceExpectGas;
    }

    estimateGas(rawTx, callback) {
        callback(this.estimateGasExpectErr, this.estimateGasExpectGas);
    }

    sendSignedTransaction (txRawTransaction, callback) {
        assert.equal(txRawTransaction, this.sendSignedTransactionTxRawTransactionExpect);
        if (this.sendSignedTransactionExceptionExpect) {
            throw new Error(this.sendSignedTransactionExceptionExpect);
        }
        callback(this.sendSignedTransactionErrExpect, this.sendSignedTransactionTxHashExpect);
    }

    subscribe(theme, obj, callback) {
        assert.equal(theme, this.subscribeThemeExpect);
        assert.deepEqual(obj, this.subscribeObjExpect);
        callback(this.subscribeErrExpect, this.subscribeResExpect);
        return this.subscribeReturnsExpect;
    }
}

class Utils {
    constructor() {
        this.web3 = new Web3();
        this._ = this;

        this.findJsonInterfaceExpect = null;
        this.findExpect = false;
    }

    toHex(val) {
        return this.web3.utils.toHex(val);
    }

    toWei(val, unit) {
        return this.web3.utils.toWei(val, unit);
    }

    find(jsonInterface, condition){
        let interf = jsonInterface.find(condition);
        interf.signature = 'test';
        return interf;
    }
}

class FakeWeb3 {
    constructor() {
        this.eth = new FakeEth();
        this.utils = new Utils();
    }
}

module.exports = {
    FakeWeb3
};

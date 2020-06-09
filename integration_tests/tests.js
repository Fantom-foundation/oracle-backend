const { abi } = require('./bin/abi');
const bin = require('./bin/bin');
const fs = require('fs');
const accConfig = require('../oracleApp/config');
const Cases = require('./cases');

class IntegrationTests {
    constructor(coinbase, web3, newAccCount, contractAddr) {
        this.coinbase = coinbase;
        this.web3 = web3;
        this.accounts = [];
        this.newAccConfigs = [];
        this.accCount = newAccCount;
        this.oracleContract = new this.web3.eth.Contract(abi);
        this.testCases = new Cases();
    }

    async test() {
        const web3 = this.web3;
        const from = this.coinbase.address;
        const sleep = this.sleep;

        console.log("Init test cases");

        this.testCases.addCase("prices updated", async () => {
            const TransactionHandler = require('../oracleApp/contractHandler/transactionsHandler');
            const contractAddress = require('./accounts-configs/contract.json');

            let oracleContract = new web3.eth.Contract(abi, contractAddress.contractAddress);
            let txHandler = new TransactionHandler(web3, oracleContract);

            const shouldPrice = "10000";
            const symb1 = "SYMB1";
            const symb2 = "SYMB2";

            for (let index = 1; index <= 3; index++) {
                let accConfig = require(`./accounts-configs/account-config${index}/config`);
                txHandler.account = accConfig.oracleContract.sender.keyObject;

                let pairUpdateTxHash = await txHandler.newSignedTx({
                    accountFrom: txHandler.account,
                    to: txHandler.contractAddr,
                    value: "0",
                    memo: txHandler.oracle.methods.requestPairUpdate(symb1, symb2).encodeABI(),
                    gas: 2100000,
                    nonceInc: true,
                    web3Delegate: web3
                });
            }
            await sleep(10000);

            let resp = await new Promise(resolve => {
                oracleContract.methods.getPairPrice(symb1, symb2).call({ from }, (err, result) => {
                    if (!err) {
                        resolve(result);
                    } else {
                        console.log('getPairPrice err', err);
                    }
                });
            })

            if (resp != shouldPrice) {
                throw Error(`getPairPrice for symb1:${symb1} and symb2:${symb2} should:${shouldPrice} - got: ${resp}`);
            }
        });

        console.log("Start tests");
        await this.testCases.run();
    }

    async runDeps() {
        await this.createAccs();
        await this.deployOracleContract();
        await this.saveAccountsConfigs();
    }

    async deployOracleContract() {
        console.log("deploy contract");
        await this.deployContract();
        for (let i = 0; i < this.newAccConfigs.length; i++) {
            let cfg = this.newAccConfigs[i];
            cfg.oracleContract.contractAddress = this.oracleContract.options.address.toLowerCase();
        }
    }

    async createAccs() {
        console.log("create accounts");
        const passwd = "1";
        const value = "6350000";
        await this.createAccounts(passwd, value);

        for (let i = 0; i < this.accounts.length; i++) {
            let acc = this.accounts[i];
            acc.keystore.address = acc.account.address.toLowerCase();
            let newAccConfig = {
                currencySched: accConfig.currencySched,
                oracleContract: {
                    contractAddress: "",
                    defaultHost: accConfig.oracleContract.defaultHost,
                    defaultPortRpc: accConfig.oracleContract.defaultPortRpc,
                    defaultPortWs: accConfig.oracleContract.defaultPortWs,
                    priceUpdateTimeout: accConfig.oracleContract.priceUpdateTimeout,
                    sender: {
                        keyObject: acc.keystore,
                        privateKey: acc.account.privateKey,
                    }
                },
            };
            newAccConfig.oracleContract.sender.keyObject.privateKey = acc.account.privateKey;
            this.newAccConfigs.push(newAccConfig);
        }
    }

    async saveAccountsConfigs() {
        for (let i = 0; i < this.newAccConfigs.length; i++) {
            const cfg = this.newAccConfigs[i];
            const jsCfg = `const config = ${JSON.stringify(cfg)};\n module.exports = config;`
            fs.writeFile(`accounts-configs/account-config${i + 1}/config.js`, jsCfg, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    }

    async createAccounts(passwd, value) {
        for (let i = 0; i < this.accCount; i++) {
            let newAcc = await this.web3.eth.accounts.create();
            let privateKey = newAcc.privateKey;
            var keystore = await this.web3.eth.accounts.encrypt(privateKey, passwd);

            this.accounts.push({
                account: newAcc,
                keystore: keystore,
            });

            let chainId = await this.web3.eth.net.getId((err, res) => {
                if (err)
                    console.log("getId ERROR:", err);
            });
            let nonce = await this.web3.eth.getTransactionCount(this.coinbase.address, (err, res) => {
                if (err)
                    console.log("getTransactionCount ERROR:", err);
            });
            const gasPrice = await this.web3.eth.getGasPrice();
            let rawTx = {
                from: this.coinbase.address,
                nonce: this.web3.utils.toHex(nonce),
                gasPrice: this.web3.utils.toHex(gasPrice),
                gas: this.web3.utils.toHex(1000000),
                to: newAcc.address,
                value: this.web3.utils.toHex(this.web3.utils.toWei(value, 'ether')),
                chainId: chainId
            }
            let estimatedGas = await this.estimateGas(rawTx);
            rawTx.gasLimit = this.web3.utils.toHex(estimatedGas);

            let tx = await this.web3.eth.accounts.signTransaction(rawTx, this.coinbase.privateKey);
            await this.web3.eth.sendSignedTransaction(tx.rawTransaction, (err, hash) => {
                if (err)
                    throw (err);
                console.log("create account with balance hash:", hash)
            })
        }
    }

    async createAccountWithSave(passwd, value) {
        let newAccount = await this.web3.eth.personal.newAccount(passwd);
        let ok = await this.web3.eth.personal.unlockAccount(acc1, "1", 100000000);
        console.log(`unlock account - ${newAccount}:${ok}`);
        await this.web3.eth.sendTransaction({
            from: ftm.coinbase,
            to: newAccount,
            value: value
        });
    }

    async deployContract() {
        let accountAddrs = this.accounts.map(a => a.account.address);


        const nonce = await this.web3.eth.getTransactionCount(this.coinbase.address);
        const gasPrice = await this.web3.eth.getGasPrice();
        const rawTx = {
            from: this.coinbase.address,
            gasPrice: this.web3.utils.toHex(gasPrice),
            nonce: this.web3.utils.toHex(nonce),
            gas: this.web3.utils.toHex('2100000'),
        };
        let estimatedGas = await this.estimateGas(rawTx);
        rawTx.gasLimit = this.web3.utils.toHex(estimatedGas);

        let newOracleContract = null;
        let deployData = {
            data: bin.bin,
            arguments: [accountAddrs]
        };
        await this.oracleContract.deploy(deployData)
            .send(rawTx, function (error, transactionHash) {
                if (error)
                    throw (error);
                console.log("deploy contract hash:", transactionHash);
            })
            .then(function (newContractInstance) {
                newOracleContract = newContractInstance;
                console.log("new contract address:", newContractInstance.options.address);
            });

        this.oracleContract = newOracleContract;

        let code = await this.web3.eth.getCode(newOracleContract.options.address.toLowerCase());

        fs.writeFile(`accounts-configs/contract.json`, `{"contractAddress":"${newOracleContract.options.address.toLowerCase()}"}`, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    async estimateGas(rawTx) {
        let estimateGas;
        await this.web3.eth.estimateGas(rawTx, (err, gas) => {
            if (err)
                throw (err);

            estimateGas = gas;
        });

        return estimateGas;
    };

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports.IntegrationTests = IntegrationTests;
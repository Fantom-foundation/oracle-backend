const { abi } = require('./bin/abi');
const bin = require('./bin/bin');
const fs = require('fs');

class IntegrationTests {
    constructor(coinbase, web3, newAccCount, contractAddr) {
        this.coinbase = coinbase;
        this.web3 = web3;
        this.accounts = [];
        this.accCount = newAccCount;
        this.oracleContract = new this.web3.eth.Contract(abi, contractAddr);
    }

    async run() {
        await this.createAccs();
        await this.deployOracleContract();
    }

    async deployOracleContract() {
        console.log("deploy contract");
        await this.deployContract();
    }

    async createAccs() {
        console.log("create accounts");
        const passwd = "1";
        const value = "6350000";
        await this.createAccounts(passwd, value);

        // TODO: save to json this accounts
        fs.writeFile("accounts.json", JSON.stringify(this.accounts), function(err) {
            if (err) {
                console.log(err);
            }
        });
    }

    async runTests() {
        
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

            let chainId = await this.web3.eth.net.getId();
            let nonce = await this.web3.eth.getTransactionCount(this.coinbase.address);
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
            gas: this.web3.utils.toHex(1000000),
        };
        let estimatedGas = await this.estimateGas(rawTx);
        rawTx.gasLimit = this.web3.utils.toHex(estimatedGas);

        let newOracleContract = null;
        await this.oracleContract.deploy({
            data: this.web3.utils.asciiToHex(bin),
            arguments: [accountAddrs]
        }).send(rawTx, function (error, transactionHash) {
            if (error)
                throw (error);
            console.log("deploy contract hash:", transactionHash);
        })
            .on('receipt', function (receipt) {

                console.log("receipt contract address:", receipt.contractAddress);
            })
            // .on('confirmation', function (confirmationNumber, receipt) { })
            .then(function (newContractInstance) {
                newOracleContract = newContractInstance;
                console.log("then contract address:", newContractInstance.options.address);
            });

        this.oracleContract = newOracleContract;
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
}

module.exports.IntegrationTests = IntegrationTests;
const config = require("../config");


class TransactionHandler {
    constructor(web3, oracle, contractAddr) {
        this.web3 = web3;
        this.oracle = oracle;
        this.contractAddr = contractAddr;
        this.from = config.address;
        // this.txStorage = txStorage;
    }

    proposePriceForPair(pair1, pair2, price) {
        return this.newSignedTx({
            from: from,
            to: this.contractAddr,
            value: "0",
            memo: this.oracle.methods.proposePriceForPair(pair1, pair2, price).encodeABI(),
            gasLimit: 200000,
            web3Delegate: this.web3
        });
    };

    async estimateGas(rawTx) {
        let estimateGas;
        await this.web3.eth.estimateGas(rawTx, (err, gas) => {
            if (err)
                throw(err);

            estimateGas = gas;
        });

        return estimateGas;
    };

    async newSignedTx({
        accountFrom,
        to,
        value,
        memo = '',
        web3Delegate = '',
        turnLogsOff = false,
    }) {
        const useWeb3 = web3Delegate || this.web3;
        const nonce = await useWeb3.eth.getTransactionCount(accountFrom.address);
        const gasPrice = await useWeb3.eth.getGasPrice();
        // const txName
        
        const rawTx = {
            from: accountFrom.address,
            to,
            value: this.web3.utils.toHex(this.web3.utils.toWei(value, 'ether')),
            gasPrice: this.web3.utils.toHex(gasPrice),
            nonce: this.web3.utils.toHex(nonce),
            data: memo
        };
        
        let estimatedGas = await this.estimateGas(rawTx);
        rawTx.gasLimit = this.web3.utils.toHex(estimatedGas);
        
        let tx = await this.web3.eth.accounts.signTransaction(rawTx, accountFrom.privateKey);
        return this.web3.eth.sendSignedTransaction(tx.rawTransaction, function(err, hash) {
            if (err) 
                throw(err);
            
            if (!turnLogsOff) 
                console.log("tx sendSignedTransaction hash:", hash);
        });
    };

}

module.exports = TransactionHandler;
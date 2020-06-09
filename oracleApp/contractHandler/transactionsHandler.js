const config = require("../config");


class TransactionHandler {
    constructor(web3, oracle) {
        this.web3 = web3;
        this.oracle = oracle;
        this.contractAddr = oracle.options.address;
        this.account = config.oracleContract.sender.keyObject;
        this.account.privateKey = config.oracleContract.sender.privateKey;
        // this.txStorage = txStorage;
    }

    async proposePriceForPair(symb1, symb2, price) {
        return await this.newSignedTx({
            accountFrom: this.account,
            to: this.contractAddr,
            value: "0",
            memo: this.oracle.methods.proposePriceForPair(symb1, symb2, price).encodeABI(),
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
        gas = '',
        nonceInc = false,
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
            gas: this.web3.utils.toHex(process.env.GAS) || this.web3.utils.toHex(gas) || undefined,
            nonce: this.web3.utils.toHex(nonce),
            data: memo
        };
        if (nonceInc)
            rawTx.nonce++;
        
        let estimatedGas = await this.estimateGas(rawTx);
        rawTx.gasLimit = this.web3.utils.toHex(estimatedGas);
        
        let tx = await this.web3.eth.accounts.signTransaction(rawTx, accountFrom.privateKey);
        let hash;
        try {
            await this.web3.eth.sendSignedTransaction(tx.rawTransaction, function(err, txHash) {
                if (err) 
                    console.log("transaction error:", err);
                
                if (!turnLogsOff) 
                    console.log("tx sendSignedTransaction hash:", txHash);
                hash = txHash;
            });
        } 
        catch (exception) {
            console.log("exception was thrown:", exception);
            throw exception
        }
        return hash;
    };

}

module.exports = TransactionHandler;
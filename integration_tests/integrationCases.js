
// common stuff for all the tests
// oracle integration tests should work the following way:
// 1. request docker containers with oracle-backend instances 
// 2. sleep until transactions resolve
// 3. check that changes are valid. 

// So the testing requires special testApis to run (and provide price data, including special false/malfare data)

// works incorrect and have to be eliminated. It does not request a server working as docker container, only sends transactions via simple web3 
// it also has incorrect method 
async function testPricesUpdated() {
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
    return;
};

async function validTestPricesUpdated() {
}

async function testMalfareData() {
}

module.exports.testPricesUpdated = testPricesUpdated;
module.exports.validTestPricesUpdated = validTestPricesUpdated;
module.exports.testMalfareData = testMalfareData;
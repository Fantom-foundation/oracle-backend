var CronJob = require('cron').CronJob;
var priceJob = require('./priceJobs');
var config = require('../config');

var oracleContract;

function schedule(oracleContractHandler) {
    oracleContract = oracleContractHandler;
    oracleContract.handlePriceUpdateRequest(() => {console.log("")});
    setInterval(priceSchedule, config.currencySched.sleepTime);
}

function priceSchedule() {
    let prices = priceJob();
    prices.forEach(pricePair => {
        //let timeout = config.priceUpdateTimeout * ( i + 1);
        //setTimeout(updateContractPrices(), timeout);
    });
    console.log('asd');
}

function updateContractPrices(pricePair) {
    return () => {
        let symbs = pricePair.pairName.split("/");
        oracleContract.updatePairPrice(symbs[0], symbs[1], pricePair.price);
    }
}

module.exports = schedule;
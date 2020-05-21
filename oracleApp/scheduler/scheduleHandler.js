var CronJob = require('cron').CronJob;
var {allPricesJob, getPriceForPair} = require('./priceJobs');
var config = require('../config');

var oracleContract;

function schedule(oracleContractHandler) {
    oracleContract = oracleContractHandler;
    oracleContract.handlePriceUpdateRequest((s1, s2) => {
        const price = getPriceForPair(s1, s2);
        oracleContract.updatePairPrice(s1, s2, price);
    });
    setInterval(priceSchedule, config.currencySched.sleepTime);
}

function priceSchedule() {
    let prices = allPricesJob();
    let i = 0;
    for (let pair of prices.keys()) {
        i++;
        let timeout = config.oracleContract.priceUpdateTimeout * i;
        setTimeout(updateContractPrices(pair, prices.get(pair)), timeout);
    }
    console.log('asd');
}

function updateContractPrices(pricePair, price) {
    return () => {
        let symbs = pricePair.split("/");
        oracleContract.updatePairPrice(symbs[0], symbs[1], price);
    }
}

module.exports = schedule;
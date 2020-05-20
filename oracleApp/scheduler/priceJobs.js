const testApiHandler = require('../externalApiHandlers/testApi');
const config = require('../config');

// all sources should implement updatePrices and getPrices func

const sources = [];
config.currencySched.sources.forEach(source => {
    if (source.name == 'test_api') {
        let testApi = new testApiHandler(source);
        sources.push(testApi);
    }
});
let prices = [];

function priceJob() {
    sources.forEach(source => {
        source.updatePrices();
        savePrices(source.getPrices());
        return source.getPrices();
    });
    return prices;
}

function savePrices(prc) {
    prices.push(prc);
}

module.exports = priceJob;
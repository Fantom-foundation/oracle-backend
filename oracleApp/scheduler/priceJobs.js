const testApi = require('../externalApiHandlers/testApi');
const config = require('../config');

// all sources should implement updatePrices and getPrices func
let sources = [ testApi ];
let prices;

function priceJob() {
    sources.forEach(source => {
        source.updatePrices();
        savePrices(source.getPrices());
        return source.getPrices();
    })
}

function savePrices() {
    config
}

module.exports = priceJob;
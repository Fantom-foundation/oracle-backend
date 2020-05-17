const testApi = require('../externalApiHandlers/testApi');

// all sources should implement updatePrices and getPrices func
let sources = [ testApi ];
let prices;

function priceJob() {
    sources.forEach(source => {
        source.updatePrices();
        savePrices(source.getPrices());
    })
}

function savePrices() {

}

module.exports = priceJob;
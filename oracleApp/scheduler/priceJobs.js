const testApiHandler = require('../externalApiHandlers/testApi');
const config = require('../config');

// all sources should implement updatePrices and getPrices func

const sources = [];
const pairs = new Map();
config.currencySched.sources.forEach(source => {
    if (source.name == 'test_api') {
        let testApi = new testApiHandler(source);
        sources.push(testApi);
    }
});

config.currencySched.pairs.forEach(pair => {
    pairs[pair] = [];
})

function allPricesJob() {
    let prices = new Map();
    sources.forEach(source => {
        source.updatePrices(pairs);
        savePrices(source.getPrices(), prices);
    });
    return pricesToMedians(prices);
}

function getPriceForPair(symb1, symb2) {
    const pair = [`${symb1}/${symb2}`];
    let price;
    sources.forEach(source => {
        source.updatePrices(pair);
        price = source.getPairPrice(pair);
    });
    if (price)
        return price;
    return 0;
}

function savePrices(prc, prices) {
    for (const key of prc.keys()) {
        if (!prices.get(key)) {
            prices.set(key, []);
        }
        prices.set(key, prc.get(key));
    }
}

function pricesToMedians(pricesMap) {
    let mapOfMedians = new Map();
    for (let key of pricesMap.keys()) {
        price = pricesMap.get(key);
        if (!price.length || price.length < 1 ||  typeof(price) == "string") {
            mapOfMedians.set(key, price);
            continue;
        }

        pricesMap.get(key).sort((a, b) => {
            if (a > b) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
              // a должно быть равным b
            return 0;
        })
        let median = pricesMap[key][pricesMap.length / 2];
        mapOfMedians.set(key, median)
    }
    return mapOfMedians;
}

module.exports = { 
    allPricesJob: allPricesJob,
    getPriceForPair: getPriceForPair
};
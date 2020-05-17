const request = require('request-promise');
var config = require('../config');


const tokenPrices = [ { "SYMB": "10000" } ]

class CoinMarketCap {
    constructor(options, currencies) {
        this.name = options.name;
        this.currencies = currencies;
        this.currenciesStr = currencies.join(",");
        this.apiKey = options.apiKey;
        
    }

    updatePrices() {
        let reqOpts = {
            method: 'GET',
            uri: 'https://localhost:9991',
            body: {
              'pair': "BTC/USD"
            },
            json: true,
            gzip: true
        };

        rp(options)
          .then(function (res) {
          console.log(res);
        }).catch(function (err) {
          console.log(err);
        });
    }

    getPrices() {
      return tokenPrices;
    }
}

module.exports = CoinMarketCap;
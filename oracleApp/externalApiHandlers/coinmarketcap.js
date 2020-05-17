

// {
//     "name": "coin market cap",
//     "entryPoint": "https://pro-api.coinmarketcap.com",
//     "requestPattern": {
//         "method": "GET",
//         "endpointPattern": "/v1/cryptocurrency/listings/latest",
//         "qs": {
//             "start": "1",
//             "limit": "5000",
//             "convert": "%currency1%"
//           },
//           "headers": {
//             "X-CMC_PRO_API_KEY": "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c"
//           },
//           "json": true,
//           "gzip": true
//     },
//     "responsePattern": {
// 
//     }
// },


// {
//     "name": "test api 1",
//     "excludeCurrencies": ["BTC"],
//     "apiKey": "123",
//     "weight": 10
// }

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
            uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map',
            qs: {
              'symbol': this.currenciesStr
            },
            headers: {
              'X-CMC_PRO_API_KEY': options.apiKey
            },
            json: true,
            gzip: true
        };
    }
}
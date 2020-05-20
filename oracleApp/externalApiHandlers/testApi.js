const request = require('request-promise');
var config = require('../config');


const tokenPrices = [ { 
  pairName: "SYMB1/SYMB2",
  price: "10000" 
} ]

class TestApi {
  constructor(options, ignorePairs) {
      this.name = options.name;
      this.ignorePairs = ignorePairs;
      this.apiKey = options.apiKey;      
  }

  updatePrices() {
    let reqOpts = {
      method: 'GET',
      uri: 'http://localhost:9991',
      body: {
        'pair': "BTC/USD"
      },
      json: true,
      gzip: true
    };

    request(reqOpts)
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

module.exports = TestApi;
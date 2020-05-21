const request = require('request-promise');
var config = require('../config');


const tokenPrices = new Map();
tokenPrices.set("SYMB1/SYMB2", "10000");

class TestApi {
  constructor(options, ignorePairs) {
      this.name = options.name;
      this.ignorePairs = ignorePairs;
      this.apiKey = options.apiKey;      
  }

  updatePrices() {
    let tokPairs = [];
    for (const key of tokenPrices.keys()) {
      tokPairs.push(key);
    }
    let reqOpts = {
      method: 'GET',
      uri: 'http://localhost:9991',
      body: {
        'pairs': tokPairs.join("")
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

  addSymb() {

  }

  getPrices() {
    return tokenPrices;
  }

  getPairPrice(symb1, symb2) {
    let pair = symb1 + "/" + symb2;
    let price = tokenPrices[pair];
    if (!price)
      return 0;
    return price;
  }
}

module.exports = TestApi;
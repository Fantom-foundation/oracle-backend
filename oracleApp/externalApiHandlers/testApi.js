var config = require('../config');


const tokenPrices = new Map();
tokenPrices.set("SYMB1/SYMB2", "10000");

class TestApi {
  constructor(options, ignorePairs, requester) {
    this.host = process.env.TEST_SOURCE_HOST || "127.0.0.1";
    this.requester = requester;
    this.name = options.name;
    this.ignorePairs = ignorePairs;
    this.apiKey = options.apiKey;
  }

  updatePrices() {
    let tokPairs = [];
    for (const key of tokenPrices.keys()) {
      tokPairs.push(key);
    }
    const host = this.host;
    let reqOpts = {
      method: 'GET',
      uri: `http://${host}:9991`,
      body: {
        'pairs': tokPairs.join("")
      },
      json: true,
      gzip: true
    };

    if (!this.requester) {
      console.log(`TestApi.requester is empty`);
      return;
    }

    this.requester(reqOpts)
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
    let price = tokenPrices.get(pair);
    if (!price)
      return 0;
    return price;
  }
}

module.exports = TestApi;

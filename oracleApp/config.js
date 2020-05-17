
const config = {
    currencySched = {
        currencies = [ "ETH", "EUR", "BTC" ],
        sleepTime = 1000,
        sources = [
            {
                name = "test api 1",
                excludeCurrencies = ["BTC"],
                apiKey = "123",
                weight = 10
            },
            {
                name = "coin market cap",
                apiKey = "a0bd4da5-e3ef-4006-bf55-cb5a2c0713fe",
                weight = 100
            }
        ]
    }
}

module.exports

const config = {
    currencySched: {
        sleepTime: 20000,
        pairs: ["ASD/BSD", "ETH/BTC"],
        sources: [
            {
                name: "test_api",
                excludeCurrencies: ["BTC"],
                apiKey: "123",
                weight: 10
            },
            {
                name: "coin market cap",
                apiKey: "a0bd4da5-e3ef-4006-bf55-cb5a2c0713fe",
                weight: 100
            }
        ]
    },
    oracleContract: {
        contractAddress: "0x2eeb8090c681c57ada975cca0602472fe5420184",
        defaultHost: "127.0.0.1",
        defaultPortRpc: "18545",
        defaultPortWs: "18546",
        priceUpdateTimeout: 1000,

        sender: {
            keyObject: {
                address: '0xc1b93b52fbce7918c3a102f71c5473ccc755da78',
                crypto: {
                  cipher: 'aes-128-ctr',
                  ciphertext: '5fe75683e5052547739f3283d22a53ae2d24d997f7591b7536d579396b4d0c98',
                  cipherparams: { iv: '0302b8c78ec7cf59038994009db2e5dd' },
                  kdf: 'scrypt',
                  kdfparams: {
                    dklen: 32,
                    n: 262144,
                    p: 1,
                    r: 8,
                    salt: '583654e11723ce161466ffcbe48e71151b46ff9bf8f7c5cb4b27a363f55138f8'
                  },
                  mac: 'e72bd4ba193b3d7f272b2a0a208c29ccfcaaefbd9fce0184935e3d7d54484671'
                },
                id: '1e65b478-b5f6-425c-9517-3fe443ef18ca',
                version: 3
            },
            privateKey: "5598df828c63bbe433f58014083521b759afd8b67025cc00eb60d39f942a78a2"
        }
    }
}

module.exports = config;
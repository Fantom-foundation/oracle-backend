const Web3 = require('web3');
const commander = require('commander');
const keythereum = require("keythereum-pure-js");
const config = require("./config.json");
const configOracleApp = require('../oracleApp/config');
const { IntegrationTests } = require('./tests');
const program = new commander.Command();

program
  .option('-h, --host <type>', 'rpc host. if not set localhost is used')
  .option('-p, --port <type>', 'rpc port. if not set 18545 is used')
  .option('-c, --coinbase', 'use coinbase from config')
  .option('-a, --accounts <type>', 'new accounts count, default - 3')
  .option('-d, --deploy', 'only contract deploy')
  .option('-n, --accs', 'only create accounts');

program.parse(process.argv);

const defaultHost = "localhost";
const defaultPort = "18545";
const defaultAccountsCount = 3;
const defaultContractAddress = '0xfc00face00000000000000000000000000000000';

let host = program.host ? program.host : defaultHost;
let port = program.port ? program.port : defaultPort;
let accountsCount = program.accounts ? program.accounts : defaultAccountsCount;
let endpoint = "http://" + host + ":" + port;

let coinbase;
if (program.coinbase) {
  coinbase = JSON.parse(program.coinbase);
} else {
  coinbase = config.coinbase;
}

if (!coinbase.privateKey) {
  coinbase.privateKey = keythereum.recover(coinbase.password.toString(), coinbase.keyObject).toString('hex');
}

const integrationTests = new IntegrationTests(
  coinbase,
  new Web3(new Web3.providers.HttpProvider(endpoint)),
  accountsCount,
  defaultContractAddress,
);

if (program.accs) {
  integrationTests.createAccs();
} else if (program.deploy) {
  integrationTests.deployOracleContract();
} else {
  integrationTests.run();
}

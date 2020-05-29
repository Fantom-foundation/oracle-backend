### Oracle backend

#### General description

The backend for the oracle is written in nodeJs on the express framework. At the moment, oracle does not use a database, in the future it is assumed to work with the lowdb package. The db module contains the database handler class, which can later be used as persistent storage. At the moment, the launch of the Oracle backend needs to be done after the launch of `testApi` (located in the same repo), since so far this is the only source of price information.

#### How to get a token price

The following logic is currently implemented. 
All sources of information are in the module. [externalApiHandlers](https://github.com/Fantom-foundation/oracle-backend/tree/master/oracleApp/externalApiHandlers)
Further, information from all sources is aggregated in the module [scheduler](https://github.com/Fantom-foundation/oracle-backend/tree/master/oracleApp/scheduler). 
in file `priceJobs.js` information is obtained from all api, after which the median is selected from the total price array (function `pricesToMedians(pricesMap))`. It is suggested that potentially priceJob might not be the only backend job.
After that, all the jobs are aggregated in the `scheduleHandler.js` file, and the timeout starts the price and contract updates. Price data for token pairs is updated with a small temporary delay, so as not to arrange DDoS transactions

#### How to add a new API for price information?

Create a handle for the `externalApiHandlers`. It is necessary that the handler implement three functions - `updatePrice`,` getPrice`, `getPairPrice (s1, s2)` 
Add a handler object to [priceJobs.js](https://github.com/Fantom-foundation/oracle-backend/blob/master/oracleApp/scheduler/priceJobs.js) following the example of adding `testApiHandler`. 

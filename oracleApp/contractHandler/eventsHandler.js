const config = require("../config");


class eventsHandler {
    constructor(web3, contract) {
        this.web3 = web3;
        this.contract = contract;
        this.subscribedEvents = {};
    }

    handleEvent(func, eventName) {
        this.subscribeLogEvent(this.contract, eventName);
    }

    subscribeLogEvent (contract, eventName) {
        const eventJsonInterface = this.web3.utils._.find(
          contract._jsonInterface,
          o => o.name === eventName && o.type === 'event',
        )
        const subscription = this.web3.eth.subscribe('logs', {
          address: contract.options.address,
          topics: ["0xb8e4756f51efc66e127cb3dee0c4bffd693c2d7ebaf4abe786ab62d2b1fbc1d6"]
        }, (error, result) => {
          if (!error) {
            const eventObj = this.web3.eth.abi.decodeLog(
              eventJsonInterface.inputs,
              result.data,
              result.topics.slice(1)
            )
            console.log(`New ${eventName}!`, eventObj);
            return;
          }
          console.log(`event error: ${error}`);
        }).on("data", function(transaction){
            console.log("data tx:", transaction);
        }).on("changed", function(transaction){
            console.log("changed tx:", transaction);
        });
        if (!this.subscribedEvents[eventName] || this.subscribedEvents[eventName].length == 0) {
            this.subscribedEvents[eventName] = [ subscription ];
        } else {
            this.subscribedEvents[eventName].push(subscription); 
        }
    }
}

module.exports = eventsHandler;
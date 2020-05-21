const config = require("../config");


class eventsHandler {
    constructor(web3, contract) {
        this.web3 = web3;
        this.contract = contract;
        this.subscribedEvents = {};
    }

    handleEvent(func, eventName) {
        this.subscribeLogEvent(this.contract, eventName, func);
    }

    subscribeLogEvent (contract, eventName, handleEventFunc) {
        const eventJsonInterface = this.web3.utils._.find(
          contract._jsonInterface,
          o => o.name === eventName && o.type === 'event',
        )
        const subscription = this.web3.eth.subscribe('logs', {
          address: contract.options.address,
          topics: [eventJsonInterface.signature]
        }, (error, result) => {
          if (!error) {
            const eventObj = this.web3.eth.abi.decodeLog(
              eventJsonInterface.inputs,
              result.data,
              result.topics.slice(1)
            )
            console.log(`New ${eventName}:`, eventObj);
            handleEventFunc(eventObj.symb1, eventObj.symb2);
            return;
          }
          console.log(`event error: ${error}`);
        });
        if (!this.subscribedEvents[eventName] || this.subscribedEvents[eventName].length == 0) {
            this.subscribedEvents[eventName] = [ subscription ];
        } else {
            this.subscribedEvents[eventName].push(subscription); 
        }
    }
}

module.exports = eventsHandler;
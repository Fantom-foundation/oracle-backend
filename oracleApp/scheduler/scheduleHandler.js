var CronJob = require('cron').CronJob;
var priceJob = require('./priceJobs');
var config = require('../config');

function schedule() {
    // priceJob();
    setInterval(function() {
        console.log('asd');
    }, 1000);
}

module.exports = schedule;
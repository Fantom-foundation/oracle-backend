var validUrl = require('valid-url');
const request = require('request-promise')

// "sources": [
//     {
//         "name": "test api 1",
//         "path": "localhost:3030",
//         "requestPattern": {
//             "reqType": "GET",
//             "endpointPattern": "/currencies/%currency1%/%currency2%"
//         }
//     },

var availableApiMethods = ["GET", "POST", "PUT"];
var currencyPairs = [];

function isAvailableMethod(methodName) {
    for (var i = 0; i < availableApiMethods.length; i++) {
        if (methodName == availableApiMethods[i])
            return true;
    }
    return false;
}

function validateJsonDescription(jsonDescription) {
    if (!jsonDescription)
        throwCannotBeEmpty("");

    if (!jsonDescription.name || jsonDescription.name == "")
        throwCannotBeEmpty("name");

    if (!jsonDescription.path || jsonDescription.path == "")
        throwCannotBeEmpty("path");

    if (!validUrl.isHttpsUri(normalizeUri(jsonDescription.entryPoint)))
        throw `${jsonDescription.uri} is not a valid https uri`

    if (!jsonDescription.requestPattern)
        throwCannotBeEmpty("requestPattern");

    if (!jsonDescription.requestPattern.reqType)
        throwCannotBeEmpty("requestPattern reqType");

    if (!isAvailableMethod(jsonDescription.requestPattern.method)) 
        throw `request type is not available. ensure that your request method is one of ${availableApiMethods}`
    
    if (!jsonDescription.requestPattern.endpointPattern)
        throwCannotBeEmpty("requestPattern endpointPattern");
}

function validatePriceRequest(currency1, currency2) {
    let firstIdx = currencyPairs.indexOf(currency1);
    if (firstIdx < 0)
        throw `currency ${currency1} is not available for request.\nPairs available for request: ${currencyPairs}`;

    let secondIdx = currencyPairs.indexOf(currency2);
    if (secondIdx < 0)
        throw `currency ${currency2} is not available for request.\nPairs available for request: ${currencyPairs}`;
}

function normalizeUri(uri) {
    const httpsPrefix = "https:\\\\";
    if (uri.startsWith(httpsPrefix))
        return uri;
    return httpsPrefix + uri;
}

function throwCannotBeEmpty(emptyVar) {
    throw `json description ${emptyVar} cannot be empty`;
}

function setAvailablePairs(pairArr) {
    currencyPairs = pairArr;
}

function createEndpoint(entryPoint, pattern, currency1, currency2) {
    
}

class CurrencyApiHandler {
    constructor(jsonDescription) {        
        validateJsonDescription(jsonDescription);
        this.name = jsonDescription.name;
        this.entryPoint = normalizeUri(jsonDescription.entryPoint);
        this.requestPattern = jsonDescription.requestPattern;
    }

    async getPrice(currency1, currency2) {
        validatePriceRequest(currency1, currency2);

        request(options)
            .then(function (response) {
                // Запрос был успешным, используйте объект ответа как хотите
            })
            .catch(function (err) {
                // Произошло что-то плохое, обработка ошибки
            })
    }

    makeRequestFromPattern(currency1, currency2) {
        let uri; 
        let endPoint = this.entryPoint;
        
        const options = {
            method: this.requestPattern.method,
            uri: 'https://risingstack.com'
        }
    }
}
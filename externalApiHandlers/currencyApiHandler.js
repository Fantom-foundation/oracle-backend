var validUrl = require('valid-url');
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

    if (!validUrl.isHttpsUri(jsonDescription.path))
        throw `${jsonDescription.path} is not a valid https uri`

    if (!jsonDescription.requestPattern)
        throwCannotBeEmpty("requestPattern");

    if (!jsonDescription.requestPattern.reqType)
        throwCannotBeEmpty("requestPattern reqType");

    if (!isAvailableMethod(jsonDescription.requestPattern.reqType)) 
        throw `request type is not available. ensure that your req type is one of ${availableApiMethods}`
    
    if (!jsonDescription.requestPattern.endpointPattern)
        throwCannotBeEmpty("requestPattern endpointPattern");
    
}

function throwCannotBeEmpty(emptyVar) {
    throw `json description ${emptyVar} cannot be empty`;
}

class CurrencyApiHandler {
    constructor(jsonDescription) {        
        validateJsonDescription(jsonDescription);
        this.name = jsonDescription.name;
        this.path = jsonDescription.path;
        this.requestPattern = jsonDescription.requestPattern;
    }

    getPrice() {
        
    }
}
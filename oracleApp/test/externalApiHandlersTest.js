const {
    validateJsonDescription,
    validatePriceRequest,
    setAvailablePairs
} = require("../externalApiHandlers/currencyApiHandler");
const assert = require("assert");

describe("External api handler tests", function () {
    it('validate json description - empty', function () {
        assert.throws(function () {
            validateJsonDescription(null);
        }, new Error("json description  cannot be empty"));
    });

    it('validate json description - name empty', function () {
        assert.throws(function () {
            validateJsonDescription({
                name: ""
            });
        }, new Error("json description name cannot be empty"));
    });

    it('validate json description - path empty', function () {
        assert.throws(function () {
            validateJsonDescription({
                name: "test",
                path: "",
            });
        }, new Error("json description path cannot be empty"));
    });

    it('validate json description - not valid https uri', function () {
        assert.throws(function () {
            validateJsonDescription({
                name: "test",
                path: "/",
                entryPoint: ""
            });
        }, new Error(" is not a valid https uri"));
    });

    it('validate json description - request pattern empty', function () {
        assert.throws(function () {
            validateJsonDescription({
                name: "test",
                path: "/",
                entryPoint: "https://127.0.0.1",
                requestPattern: "",
            });
        }, new Error("json description requestPattern cannot be empty"));
    });

    it('validate json description - request pattern reqType empty', function () {
        assert.throws(function () {
            validateJsonDescription({
                name: "test",
                path: "/",
                entryPoint: "https://127.0.0.1",
                requestPattern: "testPattern",
            });
        }, new Error("json description requestPattern reqType cannot be empty"));
    });

    it('validate json description - request pattern method is not available', function () {
        assert.throws(function () {
            validateJsonDescription({
                name: "test",
                path: "/",
                entryPoint: "https://127.0.0.1",
                requestPattern: {
                    reqType: "test",
                    method: "HEAD"
                },
            });
        }, new Error(`request type is not available. ensure that your request method is one of GET,POST,PUT`));
    });

    it('validate json description - request pattern endpointPattern empty', function () {
        assert.throws(function () {
            validateJsonDescription({
                name: "test",
                path: "/",
                entryPoint: "https://127.0.0.1",
                requestPattern: {
                    reqType: "test",
                    method: "POST",
                    endpointPattern: ""
                },
            });
        }, new Error("json description requestPattern endpointPattern cannot be empty"));
    });

    it('validate json description - valid', function () {
        assert.doesNotThrow(function () {
            validateJsonDescription({
                name: "test",
                path: "/",
                entryPoint: "https://127.0.0.1",
                requestPattern: {
                    reqType: "test",
                    method: "POST",
                    endpointPattern: "test"
                },
            });
        });
    });

    it('validate price request - first currency is not available', function () {
        setAvailablePairs(["SYMB1", "SYMB2"])

        assert.throws(function () {
            validatePriceRequest("SYMB3", "")
        },
            new Error(`currency SYMB3 is not available for request.\nPairs available for request: SYMB1,SYMB2`));
    });

    it('validate price request - second currency is not available', function () {
        setAvailablePairs(["SYMB1", "SYMB2"])

        assert.throws(function () {
                validatePriceRequest("SYMB2", "SYMB5")
            },
            new Error(`currency SYMB5 is not available for request.\nPairs available for request: SYMB1,SYMB2`));
    });

    it('validate price request - currencies is available', function () {
        setAvailablePairs(["SYMB1", "SYMB2"])

        assert.doesNotThrow(function () {
                validatePriceRequest("SYMB2", "SYMB1");
            });
    });
})

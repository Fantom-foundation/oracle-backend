
class Cases {
    constructor() {
        this.cases = [];
    }

    addCase(name, testCase) {
        this.cases.push({
            name: name,
            call: testCase
        });
    }

    async run() {
        this.cases.forEach(async (testCase) => {
            console.log("Run test:", testCase.name);
            await testCase.call();
            console.log("Finish test:", testCase.name);
        });
    }
}

module.exports = Cases;
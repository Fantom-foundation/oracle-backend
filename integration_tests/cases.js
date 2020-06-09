
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
        for (let index = 0; index < this.cases.length; index++) {
            this.cases[index];
            console.log("Run test:", this.cases[index].name, "\n");
            await this.cases[index].call();
            console.log("Finish test:", this.cases[index].name, "\n");
        }
    }
}

module.exports = Cases;
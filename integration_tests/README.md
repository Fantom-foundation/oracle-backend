### Integration tests

This integration test launches a fake node for lachisis, creates accounts for oracle backend applications, deploys an oracle contract, launches test source data to update prices, launches 3 instances of oracle backend applications, and after that the tests themselves are launched.

##### Run steps

1. Build lachesis docker image:
     ```bash
      cd <your go-lachesis directory>/docker
      make lachesis
    ```
2. Change parameters in the file [./_params.sh](_params.sh)`.
3. Run tests
  ```bash
    make integration-test
  ```

If the tests were not completed, run the script to stop [./down_test.sh](down_test.sh).

To add new cases use:
 ```js
    IntegrationTests.testCases.addCase("<name>", function(){});
 ```

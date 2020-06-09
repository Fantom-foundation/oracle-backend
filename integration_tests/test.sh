#!/usr/bin/env bash
cd $(dirname $0)
. ./_params.sh

set -e

echo "Up lachesis node"
LACHESIS=$(docker run -d --name lachesis-node -v /home/$USER/lachesis:/root -p 5050:5050 -p 18545:18545 -p 18546:18546 "lachesis" --fakenet=1/1 -port=5050 --rpc --rpcaddr 0.0.0.0 --rpcvhosts="*" --rpccorsdomain="*" --rpcapi="eth,debug,admin,web3,personal,net,txpool,ftm,sfc" --ws --wsaddr 0.0.0.0 --wsorigins="*" --wsapi="eth,debug,admin,web3,personal,net,txpool,ftm,sfc" --nocheckversion --nousb)
echo $LACHESIS
echo "Lachesis node started"

echo "generate accounts and deploy contract"
sleep 5
GENERATE_DEPS=$(node integration-test.js -h $LACHESIS_HOST -d)
echo $GENERATE_DEPS
echo "generation completed"

echo "start test source"
cd ../
TEST_SOURCE_BUILD=$(docker build --network=host -f ./testDataSource/Dockerfile -t "test-source:latest" .)
TEST_SOURCE=$(docker run -d --name test-source -p 9991:9991 test-source:latest)
cd integration_tests
echo "start test source completed"

echo "run oracle backend apps"
cd ../
for ((i = 1; i <= 3; i += 1)); do
    echo "run $i oracle backend app"
    APP_BUILD=$(docker build --network=host -f ./oracleApp/Dockerfile --build-arg GAS=$GAS --build-arg ORACLE_HOST=$LACHESIS_HOST --build-arg TEST_SOURCE_HOST=$TEST_SOURCE_HOST --build-arg PORT=300$i --build-arg CONFIG=integration_tests/accounts-configs/account-config$i -t "oracle-app-$i:latest" .)
    APP_RUN=$(docker run -d --name oracle-app-$i -p 300$i:3000 oracle-app-$i)
done
cd integration_tests

echo "run tests"
sleep 5
TESTS=$(node integration-test.js -h $LACHESIS_HOST)
echo $TESTS
echo "tests completed"

echo "stop and remove oracle apps"
for ((i = 1; i <= 3; i += 1)); do
    APP_STOP=$(docker stop oracle-app-$i && docker rm oracle-app-$i || true)
done
echo "oracle apps removed"

echo "stop and remove node"
LACHESIS_STOP=$(docker stop $LACHESIS && docker rm $LACHESIS || true)
echo "node removed"

echo "stop test source"
TEST_SOURCE_STOP=$(docker stop $TEST_SOURCE && docker rm $TEST_SOURCE || true)
echo "test source removed"

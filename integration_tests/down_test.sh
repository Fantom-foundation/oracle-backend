#!/usr/bin/env bash
cd $(dirname $0)
. ./_params.sh

set -e

echo "stop and remove oracle apps"
for ((i = 1; i <= 3; i += 1)); do
    APP_STOP=$(docker stop oracle-app-$i && docker rm oracle-app-$i || true)
done
echo "oracle apps removed"

echo "stop and remove node"
LACHESIS_STOP=$(docker stop lachesis-node && docker rm lachesis-node || true)
echo "node removed"

echo "stop and remove test source"
TEST_SOURCE_STOP=$(docker stop test-source && docker rm test-source || true)
echo "test source removed"

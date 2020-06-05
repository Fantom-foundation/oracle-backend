
SRC=.
COMPOSE_FILE=$(SRC)/docker-compose.yaml
INTEGRATION_TEST_DOWN_CMD=docker-compose -f $(COMPOSE_FILE) down --rmi local

.PHONY: integration-test
integration-test:
	./test.sh
	@sleep 10
	./down_test.sh

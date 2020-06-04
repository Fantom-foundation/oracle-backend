
SRC=.
INTEGRATION_TEST_COMPOSE_FILE=$(SRC)/docker-compose.yml
INTEGRATION_TEST_DOWN_CMD=docker-compose -f $(INTEGRATION_TEST_COMPOSE_FILE) down --rmi local

.PHONY: integration-test
integration-test:
	$(INTEGRATION_TEST_DOWN_CMD)
	docker-compose -f $(INTEGRATION_TEST_COMPOSE_FILE) up --force-recreate --build
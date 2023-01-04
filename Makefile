VERSION := 0.0.1
BUILD := $(shell git rev-parse --short HEAD)
ROOT=$(shell pwd)
NATIVE=$(ROOT)/native

install:
	@echo "Installing dependencies"
	ROOT=$(ROOT) NATIVE=$(NATIVE) $(MAKE) -C $(ROOT) install-native
	ROOT=$(ROOT) $(MAKE) -C $(ROOT) install-python

install-native:
	@echo "Installing native dependencies"
	cd $(NATIVE) && npm install

install-python:
	@echo "Installing python dependencies"
	cd $(ROOT) && pipenv install

run-native:
	@echo "Running native app"
	cd $(NATIVE) && npm run native

run-server:
	@echo "Running server"
	pipenv run uvicorn app.main:app --reload

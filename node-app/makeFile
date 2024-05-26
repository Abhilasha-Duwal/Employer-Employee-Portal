#!make
include .env
export $(shell sed 's/=.*//' .env)

build:
	@printf "\033[0;32m>>> building local services\033[0m\n"
	docker-compose up --build

start:
	@printf "\033[0;32m>>> Starting local services\033[0m\n"
	docker-compose up -d

stop:
	@printf "\033[0;32m>>> Stopping local services\033[0m\n"
	docker-compose down \
		--remove-orphans \
		--rmi local
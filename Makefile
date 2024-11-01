prod_up:
	docker compose up

dev_up:
	docker compose -f docker-compose.traefik.yaml up -d ; \
	docker compose -f docker-compose.dev.yaml up -d

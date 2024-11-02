up:
	docker compose -f docker-compose.traefik.yaml up -d ; \
	docker compose -f docker-compose.yaml up -d

down:
	docker compose -f docker-compose.traefik.yaml down; \
	docker compose -f docker-compose.yaml down



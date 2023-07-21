dev/build:
	docker compose -f docker-compose.dev.yaml build --no-cache

dev/up:
	docker compose -f docker-compose.dev.yaml up -d

dev/restart:
	docker compose -f docker-compose.dev.yaml restart

dev/up/build:
	docker compose -f docker-compose.dev.yaml up -d --build

dev/down:
	docker compose -f docker-compose.dev.yaml down --remove-orphans

dev/ps:
	docker compose -f docker-compose.dev.yaml ps

dev/logs:
	docker compose -f docker-compose.dev.yaml logs -f

dev/logs/web:
	docker compose -f docker-compose.dev.yaml logs -f web

dev/shell:
	docker compose -f docker-compose.dev.yaml exec web bash

dev/db/migrate:
	docker compose -f docker-compose.dev.yaml exec web npx prisma migrate dev
	docker compose -f docker-compose.dev.yaml exec web npx prisma generate

dev/db/reset:
	docker compose -f docker-compose.dev.yaml exec web npx prisma migrate reset --force
	docker compose -f docker-compose.dev.yaml exec web npx prisma generate

dev/test:
	echo "not implemented"
	exit 1

dev/setup: dev/build dev/up dev/migrate
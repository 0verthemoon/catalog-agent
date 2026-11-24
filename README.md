# AI Catalog Agent

## Локальный запуск

Установите Go 1.27.4 или новее, Bun 1.4.5 и Docker с плагином Compose.

Из корня репозитория установите зависимости TypeScript и запустите PostgreSQL.
В PowerShell для копирования файла используйте `Copy-Item .env.example .env`.

```sh
bun install --frozen-lockfile
cp .env.example .env
docker compose up -d --wait postgres
```

PostgreSQL по умолчанию доступен на `127.0.0.1:15432`. Образ применяет `POSTGRES_DB`,
`POSTGRES_USER` и `POSTGRES_PASSWORD` при первой инициализации пустого тома. Команда
`docker compose down` сохраняет том вместе с базой, ролями и их паролями.

Чтобы сменить пароль существующей роли, откройте `psql` командой
`docker compose exec postgres psql -U catalog -d catalog` (подставьте текущие имя роли и базы).
Выполните `\password`, введите новый пароль по приглашению и выйдите через `\q`. Затем
обновите `POSTGRES_PASSWORD` в `.env` и выполните `docker compose up -d --wait postgres`.

Запустите backend в отдельном терминале.

```sh
cd backend
go run .
```

`GET http://127.0.0.1:8080/health` возвращает HTTP 200 и `{"status":"ok"}`. Этот endpoint проверяет
работу HTTP-сервера. Чтобы изменить адрес прослушивания, задайте переменную окружения `HTTP_ADDR`.

Из корня репозитория запустите frontend на `http://localhost:5173` командой `bun run dev`.
Команда `bun run agent` запускает заготовку CLI.

## Проверки

В корне выполните `bun run check` для форматирования, линтинга, проверки типов и тестов.
`bun run build` собирает frontend и agent в их каталогах `dist/`.

Для Go в каталоге `backend` выполните `gofmt -l .`, `go vet ./...`, `go test ./...`
и `go build ./...`.

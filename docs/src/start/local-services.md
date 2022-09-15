# Local services

Aether includes a [Docker Compose](https://docs.docker.com/compose/) configuration for starting a PostgreSQL server, powered by [Supabase's fork](https://github.com/supabase/postgres). By default, this database should be configured using the `POSTGRES_*` environment variables — added to `.env.defaults`.

## Adding Services

Consider your application requires a [Redis](https://redis.io) database to provides its functionality. While developing your application, you can easily start-and-stop this (and your Postgres) database using a single command by adding a `service` definition:

> This example uses the [Bitnami Redis image](https://hub.docker.com/r/bitnami/redis), as it supports configuration via environment variables.

```docker-compose
services:
  postgres:
    ...

  redis:
    image: bitnami/redis:7.0.4
    env_file:
      - .env.defaults
    ports:
      - 6379:6379
```

Then, in `.env.defaults` (so it's available to all members of your team), add a password for your Redis database.

```env
REDIS_PASSWORD=secret
```

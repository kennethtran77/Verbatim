## Files

- `init_db.sql` — schema. Mounted into both containers as the entrypoint init
  script; also read by `server/tests/helpers/test_db.ts` when resetting the
  test schema.
- `docker-compose.dev.yml` — long-running dev DB on port `5432`. Data persists
  in a named volume across `down` (only `down -v` wipes it).
- `docker-compose.test.yml` — short-lived test DB on port `5433`. Volume is
  always wiped on `down -v`. Has a healthcheck so `--wait` returns only when
  Postgres is ready to accept connections.

## Commands (run from repo root)

| Script | Behavior |
| --- | --- |
| `npm run db:dev:up` / `db:dev:down` | Start / stop the dev container (data persists) |
| `npm run db:dev:reset` | Wipe the dev volume and reapply `init_db.sql` |
| `npm run db:test:up` / `db:test:down` | Start / stop the test container |
| `npm run db:test:reset` | Drop the public schema in the test DB and reapply `init_db.sql` (does not touch the container) |

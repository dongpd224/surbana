cd pgdata
mkdir -p pg_snapshots
mkdir -p pg_commit_ts
mkdir -p pg_notify
mkdir -p pg_replslot
mkdir -p pg_tblspc
mkdir -p pg_twophase
cd pg_logical
mkdir -p snapshots
mkdir -p mappings


docker-compose up
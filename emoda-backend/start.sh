#!/bin/sh
set -e
echo "==> Rodando migrations..."
node ./node_modules/.bin/knex migrate:latest
echo "==> Subindo servidor..."
exec node index.js

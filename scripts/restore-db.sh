#!/bin/bash
# Restaura um dump do e-moda no banco configurado em /apps/emoda-v1/.env.
# Idempotente: o dump traz DROP TABLE IF EXISTS em cada tabela.
#
# Uso, no servidor: cd /apps/emoda-v1 && ./restore-db.sh [arquivo.sql.gz]
set -euo pipefail

APP_DIR=${APP_DIR:-/apps/emoda-v1}
DUMP=${1:-$APP_DIR/Base-restore.sql.gz}
cd "$APP_DIR"

# Lê o .env sem interpretar o conteúdo — senha com $, ! ou aspas quebraria um "source".
# O ".env" guarda cifrões dobrados (veja o comentário no .env.example), então desfazemos aqui.
val() { sed -n "s/^$1=//p" .env | head -1; }
val_pass() { val DB_PASS | sed 's/\$\$/$/g'; }

DB_HOST=$(val DB_HOST); DB_PORT=$(val DB_PORT)
DB_USER=$(val DB_USER); DB_NAME=$(val DB_NAME)
export MYSQL_PWD=$(val_pass)

if [ "$DB_USER" = "PREENCHER" ]; then
  echo "ERRO: preencha DB_USER e DB_PASS em $APP_DIR/.env antes de rodar."; exit 1
fi
test -f "$DUMP" || { echo "ERRO: dump não encontrado: $DUMP"; exit 1; }

MY="mysql -h $DB_HOST -P $DB_PORT -u $DB_USER"

echo "==> Testando conexão em $DB_HOST:$DB_PORT (banco $DB_NAME)..."
$MY "$DB_NAME" -e "SELECT 1" > /dev/null
echo "    conexão OK"

ANTES=$($MY -N -B -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=\"$DB_NAME\"")
echo "==> Tabelas hoje em $DB_NAME: $ANTES"

echo "==> Restaurando $DUMP (pode levar alguns minutos)..."
case "$DUMP" in
  *.gz) gunzip -c "$DUMP" | $MY "$DB_NAME" ;;
  *)    $MY "$DB_NAME" < "$DUMP" ;;
esac

echo "==> Conferindo..."
$MY "$DB_NAME" -e "SELECT COUNT(*) AS tabelas FROM information_schema.tables WHERE table_schema=\"$DB_NAME\";
  SELECT (SELECT COUNT(*) FROM usuario) AS usuarios, (SELECT COUNT(*) FROM empresa) AS empresas,
         (SELECT COUNT(*) FROM cliente) AS clientes, (SELECT COUNT(*) FROM produto) AS produtos;"
echo "==> Restore concluído."

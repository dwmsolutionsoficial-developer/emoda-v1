#!/usr/bin/env bash
# Build de produção do frontend.
#
# O vue-cli-service 3 termina o build e imprime "Build complete", mas o processo
# não encerra no runner do GitHub Actions — o step ficava pendurado até o limite
# do job. Em vez de esperar o processo sair, aguardamos o marcador de conclusão
# no log e encerramos o processo aqui.
set -euo pipefail

cd "$(dirname "$0")/../emoda-frontend"

LOG=$(mktemp)
TIMEOUT=${BUILD_TIMEOUT:-900}

yarn build > "$LOG" 2>&1 &
PID=$!

concluido=0
for _ in $(seq "$TIMEOUT"); do
  if grep -q "Build complete" "$LOG"; then
    concluido=1
    sleep 2   # deixa o webpack terminar de escrever o relatório
    break
  fi
  kill -0 "$PID" 2>/dev/null || break
  sleep 1
done

kill "$PID" 2>/dev/null || true
wait "$PID" 2>/dev/null || true

cat "$LOG"

if [ "$concluido" != "1" ]; then
  echo "::error::o build do frontend não chegou a 'Build complete'"
  exit 1
fi

test -f dist/index.html || { echo "::error::dist/index.html não foi gerado"; exit 1; }
echo "==> Build do frontend concluído."

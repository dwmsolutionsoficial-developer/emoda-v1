#!/bin/bash
# Execute este script UMA VEZ no servidor.
set -e

APP_DIR=/apps/emoda-v1

echo "==> Criando estrutura de diretórios..."
sudo mkdir -p $APP_DIR/{backend,frontend}
sudo chown -R "$USER:$USER" $APP_DIR

echo ""
echo "==> Gerando par de chaves SSH para o GitHub Actions..."
ssh-keygen -t ed25519 -C "github-actions-emoda-v1" -f /tmp/emoda_v1_deploy -N ""

echo ""
echo "==> Registrando chave pública no servidor..."
cat /tmp/emoda_v1_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

echo ""
echo "=================================================================="
echo " CHAVE PRIVADA — Copie tudo abaixo e salve no GitHub Secret"
echo " Nome do secret: SSH_PRIVATE_KEY"
echo "=================================================================="
cat /tmp/emoda_v1_deploy
echo "=================================================================="

echo ""
echo "==> Criando $APP_DIR/.env com valores base..."
cat > $APP_DIR/.env << 'ENVEOF'
AMBIENTE=PROD
PORT=4000
HOST_PORT=4002
FRONTEND_URL=https://www.emodaapp.com.br

DB_HOST=172.31.0.6
DB_PORT=3306
DB_USER=root
DB_PASS=SUBSTITUIR
DB_NAME=emodav1

DB_SSL=false
DB_SSL_CA=/app/certs/global-bundle.pem

JWT_SECRET=SUBSTITUIR
ENVEOF

chmod 600 $APP_DIR/.env

echo ""
echo "==> Criando docker-compose.yml em $APP_DIR/..."
cat > $APP_DIR/docker-compose.yml << 'COMPOSEEOF'
services:
  backend:
    build: ./backend
    container_name: emoda-v1-backend
    restart: always
    ports:
      - "${HOST_PORT:-4002}:4000"
    env_file: .env
    environment:
      TZ: America/Sao_Paulo
    networks:
      - emoda-v1-net

networks:
  emoda-v1-net:
    driver: bridge
COMPOSEEOF

echo ""
echo "==> Removendo chaves temporárias..."
rm /tmp/emoda_v1_deploy /tmp/emoda_v1_deploy.pub

echo ""
echo "=================================================================="
echo " PRÓXIMOS PASSOS:"
echo ""
echo " 1. Preencha as senhas no .env:"
echo "    nano $APP_DIR/.env"
echo "    Para gerar segredos: openssl rand -hex 64"
echo "    Se a senha do banco tiver cifrao, dobre-o: ab\$cd -> ab\$\$cd"
echo "    (o Docker Compose interpola o .env e comeria o caractere seguinte)"
echo ""
echo " 2. Configure o Nginx:"
echo "    sudo nano /etc/nginx/sites-available/emoda-v1"
echo "    (use o conteúdo do arquivo nginx-host.conf do projeto)"
echo "    sudo ln -s /etc/nginx/sites-available/emoda-v1 /etc/nginx/sites-enabled/"
echo "    sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo " 3. Adicione no GitHub (Settings -> Secrets and variables -> Actions):"
echo "    Secrets:   SSH_HOST, SSH_PORT, SSH_USER, SSH_PRIVATE_KEY"
echo "    Variables: VUE_APP_API_URL = https://www.emodaapp.com.br/api"
echo "=================================================================="

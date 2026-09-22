# Esteira CI/CD — e-moda-v1

Mesma arquitetura do projeto **e-moda**: GitHub Actions faz build/deploy por SSH,
backend em container Docker e frontend estático servido pelo Nginx do host.

```
push em main
   ├── emoda-backend/**  → deploy-backend.yml  → scp → docker compose build/up
   └── emoda-frontend/** → deploy-frontend.yml → yarn build → scp dist → reload nginx
pull request → ci.yml (lint do backend + build do frontend)
```

## Estrutura no servidor

```
/apps/emoda-v1/
├── .env                  # variáveis do backend (criado pelo setup-server.sh)
├── docker-compose.yml
├── backend/              # recebido via scp pelo workflow
└── frontend/             # dist do Vue, servido pelo Nginx
```

## Passo a passo (primeira vez)

1. **Repositório novo**
   ```bash
   git init && git add . && git commit -m "chore: esteira CI/CD"
   git branch -M main
   git remote add origin git@github.com:<conta>/<repo>.git
   git push -u origin main
   ```

2. **Servidor** — copie e execute `setup-server.sh` (cria diretórios, `.env`,
   `docker-compose.yml` e a chave SSH do deploy). Requer Docker + plugin compose
   e Nginx instalados.

3. **Nginx** — use `nginx-host.conf` em `/etc/nginx/sites-available/emoda-v1`,
   ajuste o `server_name` e habilite o site. Depois rode o certbot para o HTTPS.

4. **GitHub → Settings → Secrets and variables → Actions**

   | Tipo     | Nome              | Exemplo                                        |
   |----------|-------------------|------------------------------------------------|
   | Secret   | `SSH_HOST`        | `170.150.135.190`                              |
   | Secret   | `SSH_PORT`        | `4100`                                         |
   | Secret   | `SSH_USER`        | `admin`                                        |
   | Secret   | `SSH_PRIVATE_KEY` | chave impressa pelo `setup-server.sh`          |
   | Variable | `VUE_APP_API_URL` | `https://www.emodaapp.com.br/api`     |

5. Dispare os dois workflows manualmente (**Actions → Run workflow**) no primeiro deploy.

## Valores a revisar antes de subir

Foram usados defaults para não colidir com o e-moda que já roda no servidor —
troque se o seu cenário for outro:

- diretório `/apps/emoda-v1` (workflows, compose, nginx, setup)
- porta publicada no host `HOST_PORT=4002` (dentro do container continua 4000)
- domínio `www.emodaapp.com.br` (nginx + `FRONTEND_URL` + `VUE_APP_API_URL`)

## Configuração da aplicação

O backend agora lê tudo de `emoda-backend/config/env.js`, que prioriza variáveis
de ambiente e só cai no módulo legado `emoda-backend/.env` quando ele existir
(desenvolvimento local — modelo em `emoda-backend/.env.example`).

Variáveis: `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`,
`JWT_SECRET`, e opcionalmente `DB_SSL` / `DB_SSL_CA` (o `global-bundle.pem` da AWS
está em `emoda-backend/certs/` e vai junto na imagem).

O frontend lê `VUE_APP_API_URL` em tempo de build; sem ela, usa `http://localhost:4000`.

## Notas do stack legado

- **Node 16** em todo lugar (imagem e runners): `vue-cli-service` 3 / webpack 4 não
  sobem no OpenSSL 3 do Node 18+, e `knex` 0.15 / `mysql` 2.x são da mesma época.
- O driver `mysql` 2.x não fala `caching_sha2_password`. Em MySQL 8, o usuário da
  aplicação precisa de `ALTER USER ... IDENTIFIED WITH mysql_native_password`.
- As migrations rodam no start do container (`start.sh`) e também no boot do
  `config/db.js` — o knex é idempotente, então não há problema.

# Node 16: o stack legado (knex 0.15 / mysql 2.x) não é compatível com versões novas.
FROM node:16-alpine

# A imagem base roda em UTC. Sem isso, datas gravadas após as 21h (BRT) caem no dia seguinte.
RUN apk add --no-cache tzdata
ENV TZ=America/Sao_Paulo

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .
RUN chmod +x start.sh

EXPOSE 4000
CMD ["./start.sh"]

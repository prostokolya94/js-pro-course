FROM node:20-alpine

RUN npm install --global @fastify/cli

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["fastify", "start"]
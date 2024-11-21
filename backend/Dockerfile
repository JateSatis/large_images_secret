FROM node:23-alpine3.19 AS build

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY . .

RUN npm cache clean --force && \
    npm install && \
    npm run build

FROM node:23-alpine3.19 AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/.env ./

RUN npm cache clean --force && \
		npm ci --omit=dev

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/index.js"]

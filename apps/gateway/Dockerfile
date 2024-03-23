FROM node:18-alpine as build-stage

WORKDIR /app

COPY . .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install -g pnpm && \
    pnpm install && \ 
    pnpm run build gateway

FROM node:18-alpine as deploy-stage

COPY --from=build-stage /app/dist /app

COPY --from=build-stage /app/package.json /app/package.json

COPY --from=build-stage /app/env/.production.env /app/apps/gateway/.production.env

COPY --from=build-stage /app/proto /app/apps/gateway/proto

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --production

EXPOSE 3000

CMD ["node", "/app/apps/gateway/main.js"]


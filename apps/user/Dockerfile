FROM node:18-alpine as build-stage

WORKDIR /app

COPY . .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install -g pnpm && \ 
    pnpm install && \ 
    pnpm run build user

FROM node:18-alpine as deploy-stage

COPY --from=build-stage /app/dist /app

COPY --from=build-stage /app/package.json /app/package.json

COPY --from=build-stage /app/env/.production.env /app/apps/user/.production.env

COPY --from=build-stage /app/proto /app/apps/user/proto

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --production

EXPOSE 3003

CMD ["node", "/app/apps/user/main.js"]


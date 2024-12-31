FROM node:20.12

WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN yarn install

COPY index.html ./
COPY nginx.conf ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY env.d.ts ./
COPY vite.config.ts ./
COPY src ./src
COPY public ./public

RUN yarn build

FROM nginx:1.21
COPY --from=0 /usr/src/app/dist /usr/share/nginx/html
COPY --from=0 /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
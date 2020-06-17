FROM node:12

ENV HOST=0.0.0.0

EXPOSE 5000
EXPOSE 3000
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile --non-interactive

COPY . /usr/src/app
RUN yarn build

CMD yarn start

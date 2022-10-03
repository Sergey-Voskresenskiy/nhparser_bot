FROM node:16-buster
WORKDIR /app
COPY . .
RUN yarn && yarn build
CMD node dist/app.js

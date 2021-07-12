FROM node:10-alpine
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install q

COPY . /app
EXPOSE 8080
CMD ["node", "config.js"]
# Pull base image.
FROM node:18-alpine

WORKDIR /app

# copy app files
COPY package.json package.json
COPY index.js index.js
COPY lib lib

# install deps
RUN npm install

# Expose ports
expose 25
expose 3000

CMD [ "npm", "start" ]
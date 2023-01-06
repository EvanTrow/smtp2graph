# Pull base image.
FROM node:18-alpine

WORKDIR /app

# copy app files
COPY package.json package.json
COPY index.ts index.ts
COPY types.ts types.ts
COPY lib lib

# install deps
RUN npm install

# copy web ui
COPY web-app/build build

# Expose ports
expose 25
expose 8080

CMD [ "npm", "start" ]
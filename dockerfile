# Pull base image.
FROM node:22-alpine

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
EXPOSE 25
EXPOSE 465
EXPOSE 8080

CMD [ "npm", "start" ]
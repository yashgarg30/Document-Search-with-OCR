FROM node:20-bullseye
RUN apt-get update && apt-get install -y poppler-utils
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm","start"]

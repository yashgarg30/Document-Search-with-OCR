# This file is optional - docker-compose.yml uses backend Dockerfile for worker
# If you want a separate worker container, use this

FROM node:20-bullseye

# Install poppler-utils for PDF processing
RUN apt-get update && apt-get install -y poppler-utils && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY backend/ .

# Run worker
CMD ["npm", "run", "worker"]

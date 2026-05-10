FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Build production
RUN npm run build

# Install serve untuk serve static files
RUN npm install -g serve

EXPOSE 8888

# Jalankan serve untuk production
CMD ["serve", "-s", "build", "-l", "8888"]

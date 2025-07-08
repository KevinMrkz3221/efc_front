# Etapa de desarrollo para Vite + React
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY vite.config.* ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
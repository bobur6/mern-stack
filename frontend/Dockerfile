FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV VITE_API_URL=http://backend:5000

CMD ["npm", "run", "dev"] 
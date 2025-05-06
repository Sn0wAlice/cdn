FROM node:20-alpine

WORKDIR /app

COPY main.js .

RUN npm install express multer uuid

EXPOSE 3000

CMD ["node", "main.js"]
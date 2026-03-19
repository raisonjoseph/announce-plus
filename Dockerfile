FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci --production=false

COPY . .
RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start"]

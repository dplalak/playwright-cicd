# Backend API (Express + Node)
FROM node:20-alpine

WORKDIR /app

# Zależności – bez skryptów (postinstall robi build, a ./src nie jest jeszcze skopiowany)
COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install --frozen-lockfile --ignore-scripts

# Kod i build
COPY . .
RUN yarn run build

EXPOSE 8000

ENV NODE_ENV=production
ENV PORT=8000

CMD ["node", "dist/index.js"]

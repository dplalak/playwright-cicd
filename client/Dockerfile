# Frontend (React + Parcel) – build i serwowanie statycznych plików
FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install --frozen-lockfile --ignore-scripts || npm ci --ignore-scripts

COPY . .
ENV API_URI=http://localhost:8000
RUN npx parcel build src/index.html --dist-dir dist --public-url ./ --no-source-maps

EXPOSE 3000
CMD ["npx", "serve", "dist", "-l", "3000"]

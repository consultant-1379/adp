FROM armdocker.rnd.ericsson.se/aia/adp/portal-base-image:1.0.1
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]
FROM armdocker.rnd.ericsson.se/aia/adp/portal-base-image:1.0.2
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install

COPY . .

EXPOSE 28081

ENV UV_THREADPOOL_SIZE=128
ENV NODE_OPTIONS=--max_old_space_size=4096
CMD ["/bin/sh", "-c", "npm start -- --couchdbssl=${DBURL}" ]

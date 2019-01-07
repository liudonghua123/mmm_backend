FROM node as app-server
WORKDIR /app
COPY package.json /app
RUN yarn
COPY api /app/api
COPY config /app/config
COPY test /app/test
RUN ls -l /app/
CMD [ "npm", "run", "dev" ]

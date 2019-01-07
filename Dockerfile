FROM node as app-server
WORKDIR /app
COPY package.json /app
RUN yarn
COPY api config test /app/
RUN ls -l /app/
CMD [ "npm", "run", "dev" ]

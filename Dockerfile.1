FROM node as build
WORKDIR /build
RUN git clone --depth 1 https://github.com/liudonghua123/mmm
WORKDIR /build/mmm
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN yarn
RUN npm run build

FROM node as app-server
WORKDIR /app
COPY package.json /app
RUN yarn
COPY . /app
COPY --from=build /build/mmm/dist /app/build
RUN ls -l /app/build
VOLUME ["/app/db"]
CMD [ "npm", "run", "dev" ]

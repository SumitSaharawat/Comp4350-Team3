FROM node:20.17.0-alpine AS development

# make sure devDependencies are installed in this stage
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# this is the image for backend server only
WORKDIR /usr/src/server

# install dependencies
COPY package*.json .
RUN npm install

# copy src codes
COPY . .

# build the project
RUN npm run build

FROM node:20.17.0-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/server

COPY package*.json .

RUN npm install --omit=dev

COPY --from=development /usr/src/server/build ./build

# environment variables
ENV SERVER_PORT=8000
ENV REACT_ORIGIN=http://localhost:3000


CMD ["node", "./build/app"]

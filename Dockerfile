FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install typescript
RUN npm install -g typescript
RUN npm install -g ts-node

# RUN npm install
# If you are building your code for production
RUN yarn install


# Bundle app source
COPY . .

# Go to PennyIC directory
WORKDIR /usr/src/app/services/PennyIC

# Run install to grab monorepo dependencies
RUN yarn install

CMD [ "ts-node", "app.ts" ]
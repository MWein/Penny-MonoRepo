FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install typescript
RUN npm install -g typescript

# Bundle app source
COPY . .

# Install top level deps
RUN yarn install

# Build app
RUN yarn build

# Go to PennyIC directory
WORKDIR /usr/src/app/services/PennyIC

# Run install to grab monorepo dependencies
RUN yarn install

# Run the transpiled version
CMD [ "node", "app.js" ]
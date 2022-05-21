FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install top level deps
RUN yarn install --production

# Go to PennyIC directory
WORKDIR /usr/src/app/services/PennyRNS

# Run install to grab monorepo dependencies
RUN yarn install --production

# Run the transpiled version
CMD [ "node", "dev.js" ]
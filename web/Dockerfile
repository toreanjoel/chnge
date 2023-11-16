# TODO: Do separete build and steps to make the image size less
FROM node:18.18-bullseye-slim

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of your app's source code
COPY . ./

# Build your app
RUN yarn build

# Your start command
CMD ["yarn", "start"]

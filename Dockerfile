# Use the official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy your source code
COPY . .

# Optionally install nodemon globally
RUN npm install -g nodemon

# Expose the port your app runs on
EXPOSE 8080

# Run your app
# CMD ["node", "index.js"]
CMD ["npm", "run", "dev"]

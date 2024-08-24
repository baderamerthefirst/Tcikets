# Use an official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Expose the port the app will run on
EXPOSE 5000

# Command to start the app
CMD ["npm", "start"]

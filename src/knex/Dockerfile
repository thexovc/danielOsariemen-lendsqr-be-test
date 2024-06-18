# Use node 18 Alpine as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Build the NestJS application (replace with your build command if different)
RUN npm run build

# Expose the port your app runs on
EXPOSE 5000

# Run the app
CMD ["npm", "run", "start:prod"]

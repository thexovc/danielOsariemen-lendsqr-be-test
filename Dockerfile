FROM node:18.15

WORKDIR /app

COPY package.json .
RUN yarn

# Build the application
COPY . .
RUN yarn build

# Expose port 3000 for the backend application
EXPOSE 3000

CMD ["yarn", "start:prod"]
# Use the official Node.js image
FROM node:18.18.0

# Set the working directory inside the container
WORKDIR /app

COPY . .

RUN npm install

# Command to run the app
CMD ["npm", "start"]

# NOTE: This Dockerfile is meant for development since it uses dev dependencies.
FROM node:12.16.3

# Create working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install
RUN npm install --only=dev

# Copy the source code into the working directory and compile it
COPY . .
RUN npm run build

# Expose port
# TODO: Read port to expose from environment
EXPOSE 5000

# Run the application
CMD ["npm", "run", "start"]

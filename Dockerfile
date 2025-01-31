FROM node:22.13.0-alpine

# Install dependencies
RUN apt-get update && apt-get install -y openssl

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Generate Prisma Client
RUN npm run prisma:generate

# Build the TypeScript files
RUN npm run build

# Expose port 8080
EXPOSE 8000

# Start the app
ENTRYPOINT ["sh", "-c", "npm run prisma:prod:migrate && npm run start"]

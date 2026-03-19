FROM node:18-alpine

WORKDIR /app

# Copy package config and install dependencies
COPY package.json .
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Start React app
CMD ["npm", "run", "dev", "--", "--host"]

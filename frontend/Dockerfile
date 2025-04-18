# Stage 1: Build the React app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Define build arguments
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_WEBSOCKET_URL
ARG REACT_APP_ENV

# Use build argument in a layer to force rebuild on change
RUN echo "REACT_APP_API_BASE_URL: ${REACT_APP_API_BASE_URL}}" > .env
RUN echo "REACT_APP_WEBSOCKET_URL: ${REACT_APP_WEBSOCKET_URL}" > .env
RUN echo "REACT_APP_ENV: ${REACT_APP_ENV}" > .env

# Set environment variables for the build
ARG REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
ARG REACT_APP_WEBSOCKET_URL=${REACT_APP_WEBSOCKET_URL}
ARG REACT_APP_ENV=${REACT_APP_ENV}

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output to nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

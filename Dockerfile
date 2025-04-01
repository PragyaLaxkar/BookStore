# Stage 1: Build the frontend
FROM node:18.12.1-alpine AS frontend-build
WORKDIR /app/frontend
# Copy package files first for better caching
COPY frontend/package*.json ./
RUN npm ci
# Copy frontend source files
COPY frontend/src ./src
COPY frontend/index.html ./
COPY frontend/*.js ./
COPY frontend/*.json ./

# Set API URL for frontend build
ENV VITE_API_URL=http://localhost:5000/api

# Build for production
RUN npm run build

# Stage 2: Build the backend
FROM node:18.12.1-alpine AS backend-build
WORKDIR /app/backend
# Copy package files first for better caching
COPY backend/package*.json ./
RUN npm ci
# Copy backend files
COPY backend ./

# Stage 3: Final production image (smaller)
FROM node:18.12.1-alpine AS production
# Add labels for better maintainability
LABEL maintainer="BookStore Team"
LABEL version="1.0"

# Set environment to production
ENV NODE_ENV=production
# Backend environment variables
ENV PORT=5000
ENV MONGODB_URI=mongodb://mongo:27017/bookstore
ENV JWT_SECRET=your_jwt_secret_key
ENV CORS_ORIGIN=http://localhost:3000
# Add any other required environment variables here

WORKDIR /app

# Copy frontend build artifacts
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Copy backend with only production dependencies
COPY --from=backend-build /app/backend /app/backend

# Copy .env file for backend
COPY backend/.env /app/backend/.env

# Install production dependencies only
WORKDIR /app/backend
RUN npm ci --only=production && npm cache clean --force

# Install serve for frontend static files
RUN npm install -g serve

# Expose ports
EXPOSE 3000 5000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the application with a proper init process
CMD ["sh", "-c", "node /app/backend/server.js & serve -s /app/frontend/dist -l 3000"]
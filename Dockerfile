# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# Stage 2: Build the backend
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend .

# Stage 3: Final image
FROM node:18-alpine
WORKDIR /app

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Copy backend
COPY --from=backend-build /app/backend /app/backend

# Install backend dependencies
WORKDIR /app/backend
RUN npm install --production

# Expose ports
EXPOSE 3000 5000

# Start the application
CMD ["sh", "-c", "npm run dev & serve -s /app/frontend/dist -l 3000"]
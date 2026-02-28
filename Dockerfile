FROM node:20-slim

WORKDIR /app

# Install backend dependencies
COPY backend/package.json backend/package-lock.json* backend/
RUN cd backend && npm install

# Install frontend dependencies
COPY frontend/package.json frontend/package-lock.json* frontend/
RUN cd frontend && npm install

# Copy source code
COPY backend/ backend/
COPY frontend/ frontend/

# Build backend
RUN cd backend && npx tsc

# Build frontend with empty VITE_API_URL so API calls use relative paths
RUN cd frontend && VITE_API_URL="" npx vite build

# Copy frontend build to backend/public for Express to serve
RUN cp -r frontend/dist backend/public

# Give node user ownership so SQLite can write the database file
RUN chown -R node:node /app/backend

ENV NODE_ENV=production
ENV PORT=7860

USER node

CMD ["node", "backend/dist/server.js"]

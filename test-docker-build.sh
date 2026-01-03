#!/bin/bash

# ==============================================
# Docker Build Test Script
# ==============================================
# This script tests the Docker build process locally

set -e

echo "🔧 Testing Docker build for GreenAppleX..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Clean up previous builds
print_status "Cleaning up previous builds..."
docker-compose down -v 2>/dev/null || true
docker system prune -f 2>/dev/null || true

# Create test environment file
print_status "Creating test environment configuration..."
if [ ! -f .env ]; then
    cp .env.example .env
    print_status "Created .env from .env.example - please update with your actual values"
fi

# Build the Docker images
print_status "Building Docker images..."
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    print_success "Docker build completed successfully!"
else
    print_error "Docker build failed!"
    exit 1
fi

# Test the build
print_status "Testing the container startup..."
docker-compose up -d

# Wait for services to start
sleep 10

# Check if services are running
print_status "Checking service status..."
docker-compose ps

# Test health endpoint
print_status "Testing health endpoint..."
if curl -f -s http://localhost:5000/api/health > /dev/null; then
    print_success "Health endpoint is responding!"
    curl -s http://localhost:5000/api/health | jq . || echo "Health check response received"
else
    print_error "Health endpoint is not responding"
    print_status "Checking logs..."
    docker-compose logs app
fi

# Check logs
print_status "Application logs:"
docker-compose logs --tail=20 app

# Cleanup
print_status "Cleaning up test containers..."
docker-compose down

print_success "Docker build test completed! 🎉"
print_status "Your application is ready for EC2 deployment."
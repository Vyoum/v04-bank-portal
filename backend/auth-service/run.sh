#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded from .env"
else
    echo "⚠️  Warning: .env file not found. Using default values."
fi

# Run the Spring Boot application
echo "🚀 Starting Auth Service on port ${SERVER_PORT:-8081}..."
/opt/homebrew/bin/mvn spring-boot:run

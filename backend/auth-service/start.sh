#!/bin/bash

# Export environment variables for Maven
export DB_HOST=aws-1-ap-southeast-2.pooler.supabase.com
export DB_PORT=6543
export DB_NAME=postgres
export DB_USERNAME=postgres.qycxqjoctkdvcihmqoke
export DB_PASSWORD=YeuJ0GvzXQ7sHjfO
export SERVER_PORT=8081

echo "✅ Environment variables exported"
echo "🚀 Starting Auth Service on port ${SERVER_PORT}..."
/opt/homebrew/bin/mvn spring-boot:run

#!/bin/bash

echo "✅ Environment variables exported"

# Export environment variables for Maven
export DB_HOST=aws-1-ap-southeast-2.pooler.supabase.com
export DB_PORT=6543
export DB_NAME=postgres
export DB_USERNAME=postgres.qycxqjoctkdvcihmqoke
export DB_PASSWORD=YeuJ0GvzXQ7sHjfO
export SERVER_PORT=9443

# Set Java 17 for compilation
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

echo "🚀 Starting Auth Service on port 8081..."
/opt/homebrew/bin/mvn spring-boot:run

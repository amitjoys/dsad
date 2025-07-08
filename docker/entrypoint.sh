#!/bin/bash
set -e

# Function to wait for MongoDB
wait_for_mongo() {
    echo "Waiting for MongoDB to be ready..."
    while ! curl -f ${MONGO_URL%/*}/admin > /dev/null 2>&1; do
        echo "MongoDB is unavailable - sleeping"
        sleep 2
    done
    echo "MongoDB is ready!"
}

# Function to create necessary directories
create_directories() {
    echo "Creating necessary directories..."
    mkdir -p /var/log/supervisor
    mkdir -p /var/log/nginx
    mkdir -p /app/uploads
    mkdir -p /app/static
    
    # Set proper permissions
    chown -R app:app /var/log/supervisor
    chown -R app:app /app/uploads
}

# Function to setup environment
setup_environment() {
    echo "Setting up environment..."
    
    # Copy static files if needed
    if [ -d "/app/frontend/build" ]; then
        echo "Copying frontend build files..."
        cp -r /app/frontend/build/* /app/static/ 2>/dev/null || true
    fi
}

# Function to run database migrations/setup
setup_database() {
    echo "Setting up database..."
    cd /app/backend
    
    # Run any database setup scripts here
    # python manage.py migrate || true
    echo "Database setup completed."
}

# Function to start services
start_services() {
    echo "Starting services..."
    
    # Start supervisor which will manage nginx and the backend
    exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
}

# Main execution
main() {
    echo "Starting ConstructPune application..."
    echo "Environment: ${ENVIRONMENT:-development}"
    
    # Wait for dependencies
    if [ "${ENVIRONMENT}" = "production" ]; then
        wait_for_mongo
    fi
    
    # Setup
    create_directories
    setup_environment
    setup_database
    
    # Start services
    start_services
}

# Execute main function
main "$@"
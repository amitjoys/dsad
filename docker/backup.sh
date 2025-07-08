#!/bin/bash

# ConstructPune Database Backup Script

set -e

# Configuration
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="constructpune_backup_${DATE}"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to create database backup
create_backup() {
    log "Starting database backup..."
    
    # Extract connection details from MONGO_URL
    # Format: mongodb://user:password@host:port/database?authSource=admin
    HOST=$(echo $MONGO_URL | sed 's/.*@\([^:]*\):.*/\1/')
    PORT=$(echo $MONGO_URL | sed 's/.*:\([0-9]*\)\/.*/\1/')
    USERNAME=$(echo $MONGO_URL | sed 's/mongodb:\/\/\([^:]*\):.*/\1/')
    PASSWORD=$(echo $MONGO_URL | sed 's/mongodb:\/\/[^:]*:\([^@]*\)@.*/\1/')
    DATABASE=$(echo $MONGO_URL | sed 's/.*\/\([^?]*\).*/\1/')
    
    # Create backup using mongodump
    mongodump \
        --host "${HOST}:${PORT}" \
        --username "${USERNAME}" \
        --password "${PASSWORD}" \
        --authenticationDatabase admin \
        --db "${DATABASE}" \
        --out "${BACKUP_DIR}/${BACKUP_NAME}"
    
    # Create compressed archive
    cd ${BACKUP_DIR}
    tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"
    rm -rf "${BACKUP_NAME}"
    
    log "Backup created: ${BACKUP_NAME}.tar.gz"
}

# Function to cleanup old backups (keep last 7 days)
cleanup_old_backups() {
    log "Cleaning up old backups..."
    find ${BACKUP_DIR} -name "constructpune_backup_*.tar.gz" -mtime +7 -delete
    log "Old backups cleaned up"
}

# Function to verify backup
verify_backup() {
    local backup_file="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
    
    if [ -f "$backup_file" ]; then
        local size=$(stat -f%z "$backup_file" 2>/dev/null || stat -c%s "$backup_file" 2>/dev/null)
        if [ "$size" -gt 1000 ]; then
            log "Backup verification successful. Size: ${size} bytes"
            return 0
        else
            log "ERROR: Backup file is too small. Size: ${size} bytes"
            return 1
        fi
    else
        log "ERROR: Backup file not found: $backup_file"
        return 1
    fi
}

# Function to send backup status notification (placeholder)
send_notification() {
    local status=$1
    local message=$2
    
    # This is a placeholder for notification logic
    # You can integrate with email, Slack, webhooks, etc.
    log "NOTIFICATION [$status]: $message"
}

# Main backup process
main() {
    log "=== ConstructPune Database Backup Started ==="
    
    # Check if MONGO_URL is set
    if [ -z "$MONGO_URL" ]; then
        log "ERROR: MONGO_URL environment variable is not set"
        send_notification "ERROR" "Database backup failed: MONGO_URL not set"
        exit 1
    fi
    
    # Wait for MongoDB to be ready
    log "Waiting for MongoDB to be ready..."
    while ! mongosh "$MONGO_URL" --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
        log "MongoDB is not ready yet, waiting..."
        sleep 5
    done
    log "MongoDB is ready"
    
    # Create backup
    if create_backup; then
        if verify_backup; then
            cleanup_old_backups
            send_notification "SUCCESS" "Database backup completed successfully: ${BACKUP_NAME}.tar.gz"
            log "=== Backup Process Completed Successfully ==="
        else
            send_notification "ERROR" "Database backup verification failed"
            exit 1
        fi
    else
        send_notification "ERROR" "Database backup creation failed"
        exit 1
    fi
}

# Handle script termination
trap 'log "Backup process interrupted"; exit 1' INT TERM

# Run main function
main "$@"
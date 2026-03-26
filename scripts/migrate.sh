#!/bin/bash

# TrueEHR Database Migration Script
# Handles database migrations with rollback capabilities

set -e

# Configuration
DB_NAME="trueehr"
DB_USER="trueehr"
MIGRATIONS_DIR="./migrations"
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "=== TrueEHR Database Migration ==="
echo "Target database: $DB_NAME"
echo "Timestamp: $TIMESTAMP"

# Pre-migration backup
echo "Creating pre-migration backup..."
BACKUP_FILE="${BACKUP_DIR}/pre_migration_${TIMESTAMP}.sql"
mkdir -p "$BACKUP_DIR"

pg_dump -h db -U "$DB_USER" -d "$DB_NAME" \
  --no-password \
  --clean \
  --if-exists \
  --create \
  --format=plain \
  > "$BACKUP_FILE"

gzip "$BACKUP_FILE"
echo "Pre-migration backup completed: ${BACKUP_FILE}.gz"

# Check database connectivity
echo "Testing database connection..."
psql -h db -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" > /dev/null
echo "Database connection successful"

# Run migrations
echo "Running database migrations..."
if [ -d "$MIGRATIONS_DIR" ]; then
    for migration in "$MIGRATIONS_DIR"/*.sql; do
        if [ -f "$migration" ]; then
            echo "Applying migration: $(basename "$migration")"
            psql -h db -U "$DB_USER" -d "$DB_NAME" -f "$migration"
        fi
    done
else
    echo "No migrations directory found at: $MIGRATIONS_DIR"
fi

# Verify migration success
echo "Verifying migration results..."
psql -h db -U "$DB_USER" -d "$DB_NAME" -c "\\dt" > /dev/null
echo "Migration verification successful"

# Post-migration tasks
echo "Running post-migration tasks..."
psql -h db -U "$DB_USER" -d "$DB_NAME" -c "ANALYZE;"
echo "Database statistics updated"

echo "=== Migration completed successfully ==="
echo "Backup available for rollback: ${BACKUP_FILE}.gz"
echo "To rollback: gunzip ${BACKUP_FILE}.gz && psql -h db -U $DB_USER -d $DB_NAME < $BACKUP_FILE"
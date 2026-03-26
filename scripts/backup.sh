#!/bin/bash

# TrueEHR Database Backup Script
# Provides automated backup with retention policies

set -e

# Configuration
BACKUP_DIR="/backups"
DB_NAME="trueehr"
DB_USER="trueehr"
RETENTION_DAYS=30
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/trueehr_backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting database backup: $BACKUP_FILE"

# Create database backup
pg_dump -h db -U "$DB_USER" -d "$DB_NAME" \
  --no-password \
  --verbose \
  --clean \
  --if-exists \
  --create \
  --format=plain \
  > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

echo "Backup completed: $BACKUP_FILE"
echo "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"

# Cleanup old backups
echo "Cleaning up backups older than $RETENTION_DAYS days"
find "$BACKUP_DIR" -name "trueehr_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Verify backup integrity
echo "Verifying backup integrity"
if gzip -t "$BACKUP_FILE"; then
    echo "Backup integrity check passed"
else
    echo "ERROR: Backup integrity check failed!"
    exit 1
fi

# Upload to cloud storage (optional)
if [ -n "$AWS_S3_BUCKET" ]; then
    echo "Uploading backup to S3: $AWS_S3_BUCKET"
    aws s3 cp "$BACKUP_FILE" "s3://$AWS_S3_BUCKET/backups/"
fi

echo "Backup process completed successfully"
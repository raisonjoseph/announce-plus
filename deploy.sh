#!/bin/bash
set -e

echo "Building AnnouncePlus for production..."

echo "Running Prisma generate..."
npx prisma generate

echo "Deploying to Fly.io..."
fly deploy --remote-only

echo "Done! App is live at:"
echo "https://announceplus.fly.dev"

#!/bin/sh
echo "Pulling database schema and generating Prisma client"
npx prisma db pull

echo "Generating Prisma client"
npx prisma generate

exec "$@"

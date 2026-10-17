#!/bin/bash

# Configuration - Set your S3 Bucket Name and CloudFront Distribution ID
# (You can get these from the Terraform outputs after running `terraform apply`)
S3_BUCKET="${S3_BUCKET:-sncls-prod-frontend-assets}"
CLOUDFRONT_DIST_ID="${CLOUDFRONT_DIST_ID:-E1MTNOANSLQXVA}"
BUILD_DIR="dist"

echo "--------------------------------"
echo "Building React App..."
echo "--------------------------------"

npm run build

if [ $? -ne 0 ]; then
  echo "Build failed. Aborting."
  exit 1
fi

echo "--------------------------------"
echo "Uploading build to AWS S3 ($S3_BUCKET)..."
echo "--------------------------------"

aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET" --delete

if [ $? -ne 0 ]; then
  echo "S3 sync failed. Aborting."
  exit 1
fi

if [ -n "$CLOUDFRONT_DIST_ID" ]; then
  echo "--------------------------------"
  echo "Invalidating CloudFront Cache ($CLOUDFRONT_DIST_ID)..."
  echo "--------------------------------"
  aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DIST_ID" --paths "/*"
else
  echo "Notice: CLOUDFRONT_DIST_ID not set. Skipping cache invalidation."
fi

echo "--------------------------------"
echo "Deployment successful 🚀"
echo "--------------------------------"

#!/bin/bash

SERVER_USER="catalyst"

APP_PATH="/home/$SERVER_USER/deploy/sncls"
RELEASE_PATH="$APP_PATH/releases"

BUILD_DIR="dist"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "--------------------------------"
echo "Building React app..."
echo "--------------------------------"

npm run build

if [ $? -ne 0 ]; then
  echo "Build failed. Aborting."
  exit 1
fi

echo "--------------------------------"
echo "Creating new release: $TIMESTAMP"
echo "--------------------------------"

ssh $SERVER_USER "mkdir -p $RELEASE_PATH/$TIMESTAMP"

echo "--------------------------------"
echo "Uploading build..."
echo "--------------------------------"

rsync -avz "$BUILD_DIR/" "$SERVER_USER:$RELEASE_PATH/$TIMESTAMP/"

echo "--------------------------------"
echo "Activating new release..."
echo "--------------------------------"

ssh $SERVER_USER <<EOF

ln -sfn $RELEASE_PATH/$TIMESTAMP $APP_PATH/current

sudo nginx -t
sudo systemctl reload nginx

echo "Cleaning old releases..."

cd $RELEASE_PATH
ls -dt */ | tail -n +6 | xargs rm -rf

EOF

echo "--------------------------------"
echo "Deployment successful 🚀"
echo "https://sncls.com"
echo "--------------------------------"

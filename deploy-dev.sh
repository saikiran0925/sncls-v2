#!/bin/bash

SERVER_USER="catalyst"
SERVER_IP="159.65.145.78"
DEPLOY_PATH="/home/$SERVER_USER/deploy/sncls"
LOCAL_BUILD_PATH="dist"

echo "Building the React app..."
npm run build

echo "Transferring build to server..."
scp -r $LOCAL_BUILD_PATH $SERVER_USER:$DEPLOY_PATH/

ssh $SERVER_USER <<EOF
    echo "Restarting Nginx..."
    sudo systemctl restart nginx
    echo "Deployment completed!"
EOF
